import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  className?: string;
}

const MultiImageUpload = ({ 
  value = [], 
  onChange, 
  folder = "general", 
  maxImages = 10,
  className 
}: MultiImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxImages - value.length;
    if (files.length > remainingSlots) {
      toast({
        variant: "destructive",
        title: "Demasiadas imágenes",
        description: `Solo puedes agregar ${remainingSlots} imagen(es) más.`,
      });
      return;
    }

    // Validate all files
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Tipo de archivo no válido",
          description: "Solo se permiten imágenes JPG, PNG, WebP o GIF.",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Archivo muy grande",
          description: `${file.name} excede el límite de 5MB.`,
        });
        return;
      }
    }

    setIsUploading(true);
    setProgress(10);

    const uploadedUrls: string[] = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("imgs")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("imgs")
          .getPublicUrl(data.path);

        uploadedUrls.push(urlData.publicUrl);
        setProgress(10 + ((i + 1) / totalFiles) * 80);
      }

      setProgress(100);
      onChange([...value, ...uploadedUrls]);

      toast({
        title: "Imágenes subidas",
        description: `Se subieron ${uploadedUrls.length} imagen(es) correctamente.`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error al subir",
        description: error.message || "No se pudieron subir las imágenes.",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        multiple
        disabled={isUploading || value.length >= maxImages}
      />

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {/* Add more button */}
          {value.length < maxImages && !isUploading && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/50"
            >
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {value.length === 0 && (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors bg-muted/50",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Haz clic para subir imágenes
              </span>
              <span className="text-xs text-muted-foreground/70">
                Máximo {maxImages} imágenes (5MB c/u)
              </span>
            </>
          )}
        </div>
      )}

      {isUploading && (
        <Progress value={progress} className="h-2" />
      )}

      {value.length === 0 && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar imágenes
        </Button>
      )}

      <p className="text-xs text-muted-foreground text-center">
        {value.length} de {maxImages} imágenes
      </p>
    </div>
  );
};

export default MultiImageUpload;
