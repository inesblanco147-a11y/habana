import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Video, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

const VideoUpload = ({ value, onChange, folder = "videos", className }: VideoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      toast({ variant: "destructive", title: "Tipo de archivo no válido", description: "Solo se permiten videos MP4, WebM, OGG o MOV." });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Archivo muy grande", description: "El tamaño máximo permitido es 100MB." });
      return;
    }

    setIsUploading(true);
    setProgress(10);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;
      setProgress(30);

      const { data, error } = await supabase.storage
        .from("imgs")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      setProgress(70);
      if (error) throw error;

      const { data: urlData } = supabase.storage.from("imgs").getPublicUrl(data.path);
      setProgress(100);
      onChange(urlData.publicUrl);
      toast({ title: "Video subido", description: "El video se ha subido correctamente." });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ variant: "destructive", title: "Error al subir", description: error.message || "No se pudo subir el video." });
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {value ? (
        <div className="relative group">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
            <video src={value} className="w-full h-full object-cover" muted />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
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
              <Video className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Haz clic para subir un video</span>
              <span className="text-xs text-muted-foreground/70">MP4, WebM, OGG o MOV (máx. 100MB)</span>
            </>
          )}
        </div>
      )}

      {isUploading && <Progress value={progress} className="h-2" />}

      {!value && !isUploading && (
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar video
        </Button>
      )}
    </div>
  );
};

export default VideoUpload;
