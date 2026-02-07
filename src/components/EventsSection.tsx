import { useState, useMemo } from "react";
import { Calendar, MapPin, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useEvents } from "@/hooks/useEvents";
import { useGallery } from "@/hooks/useGallery";
import { useVideos } from "@/hooks/useVideos";
import { Event } from "@/types/event";
import { Video } from "@/types/video";

const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1).split("/")[0] || null;
    }
    if (urlObj.hostname.includes("youtube.com")) {
      if (urlObj.pathname.startsWith("/embed/")) return urlObj.pathname.split("/")[2] || null;
      if (urlObj.pathname.startsWith("/v/")) return urlObj.pathname.split("/")[2] || null;
      return urlObj.searchParams.get("v");
    }
  } catch {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
    return match ? match[1] : null;
  }
  return null;
};

const EventsSection = () => {
  const { data: events = [] } = useEvents();
  const { data: galleryItems = [] } = useGallery();
  const { data: videos = [] } = useVideos();

  const allGalleryImages = useMemo(() => {
    const images: { src: string; alt: string }[] = [];
    galleryItems.forEach((item) => {
      item.images.forEach((img, idx) => {
        if (img && img !== "/placeholder.svg") {
          images.push({ src: img, alt: `${item.title} - Imagen ${idx + 1}` });
        }
      });
    });
    return images;
  }, [galleryItems]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

  const nextGalleryImage = () => {
    if (selectedEvent) setGalleryIndex((prev) => (prev + 1) % selectedEvent.images.length);
  };
  const prevGalleryImage = () => {
    if (selectedEvent)
      setGalleryIndex((prev) => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length);
  };

  return (
    <section id="events" className="bg-muted/30 py-[96px]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">Galería</h2>
            <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              Conoce nuestros eventos pasados y las actividades que realizamos para la comunidad médica y nuestros
              pacientes.
            </p>
          </div>
        </div>

        {/* Gallery Carousel */}
        {allGalleryImages.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center text-primary">Galería de Momentos</h3>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {allGalleryImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <div className="overflow-hidden rounded-xl shadow-lg group">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
              <CarouselNext className="hidden md:flex -right-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
            </Carousel>
          </div>
        )}

        {/* Events Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden bg-card border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.images[0]}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {event.featured && (
                  <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Destacado
                  </span>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{event.title}</h3>
                {/* <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p> */}
                {event.showDate !== false && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                  </div>
                )}
                {event.showLocation !== false && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  </div>
                )}
                <Button
                  onClick={() => {
                    setSelectedEvent(event);
                    setGalleryIndex(0);
                  }}
                  className="w-full bg-hasace-red hover:bg-hasace-red/30 text-primary-foreground font-semibold"
                >
                  Ver Galería
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Videos Section */}
        {videos.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center text-primary">Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const ytId = getYoutubeId(video.youtubeUrl);
                const thumb =
                  video.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "/placeholder.svg");
                return (
                  <Card
                    key={video.id}
                    className="group overflow-hidden bg-card border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={thumb}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <div className="w-14 h-14 bg-hasace-red rounded-full flex items-center justify-center shadow-lg">
                          <Play className="h-6 w-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{video.description}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Event Gallery Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                  <img
                    src={selectedEvent.images[galleryIndex]}
                    alt={`${selectedEvent.title} - Imagen ${galleryIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={prevGalleryImage}
                    className="rounded-full bg-background/80 hover:bg-background shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={nextGalleryImage}
                    className="rounded-full bg-background/80 hover:bg-background shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm font-medium">
                  {galleryIndex + 1} / {selectedEvent.images.length}
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                {selectedEvent.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryIndex(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === galleryIndex ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedEvent.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedVideo?.description || "Reproduciendo video"}</p>
          </DialogHeader>
          {selectedVideo &&
            (() => {
              const ytId = getYoutubeId(selectedVideo.youtubeUrl);
              if (!ytId) {
                return (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <a
                      href={selectedVideo.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Ver video en YouTube
                    </a>
                  </div>
                );
              }
              return (
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      key={selectedVideo.id}
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ border: 0 }}
                    />
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EventsSection;
