import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import productDefaultImage from "@/assets/product-default.jpg";

interface ProductImageCarouselProps {
  images: string[];
  fallbackImage?: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video";
  showDots?: boolean;
  showArrows?: boolean;
}

const ProductImageCarousel = ({
  images,
  fallbackImage,
  alt,
  className,
  aspectRatio = "video",
  showDots = true,
  showArrows = true,
}: ProductImageCarouselProps) => {
  const displayImages = images.length > 0 ? images : [fallbackImage || productDefaultImage];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useState(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  });

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (displayImages.length === 1) {
    return (
      <div className={cn(aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]", "overflow-hidden", className)}>
        <img src={displayImages[0]} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {displayImages.map((img, i) => (
            <div key={i} className={cn("flex-[0_0_100%] min-w-0", aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]")}>
              <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {showDots && displayImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {displayImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); emblaApi?.scrollTo(i); }}
              className={cn("w-2 h-2 rounded-full transition-colors", i === selectedIndex ? "bg-background" : "bg-background/50")}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
