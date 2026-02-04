import { useState } from "react";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useEvents } from "@/hooks/useEvents";
import { Event } from "@/types/event";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";
import event5 from "@/assets/event-5.jpg";
import event6 from "@/assets/event-6.jpg";
const allGalleryImages = [{
  src: event1,
  alt: "Congreso de medicina deportiva"
}, {
  src: event2,
  alt: "Taller de rehabilitación"
}, {
  src: event3,
  alt: "Ceremonia de certificación"
}, {
  src: event4,
  alt: "Jornada deportiva"
}, {
  src: event5,
  alt: "Feria de la salud"
}, {
  src: event6,
  alt: "Rehabilitación pediátrica"
}];
const EventsSection = () => {
  const {
    data: events = [],
    isLoading
  } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  const nextGalleryImage = () => {
    if (selectedEvent) {
      setGalleryIndex(prev => (prev + 1) % selectedEvent.images.length);
    }
  };
  const prevGalleryImage = () => {
    if (selectedEvent) {
      setGalleryIndex(prev => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length);
    }
  };
  return <section id="events" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-destructive">
            Galería
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-primary">
            Conoce nuestros eventos pasados y las actividades que realizamos para la comunidad médica y nuestros pacientes.
          </p>
        </div>

        {/* Main Gallery Carousel */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center text-primary">
            Galería de Momentos
          </h3>
          <div className="relative max-w-5xl mx-auto">
            <Carousel opts={{
            align: "start",
            loop: true
          }} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {allGalleryImages.map((image, index) => <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <div className="overflow-hidden rounded-xl shadow-lg group">
                      <img src={image.src} alt={image.alt} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
              <CarouselNext className="hidden md:flex -right-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
            </Carousel>
          </div>
        </div>

        {/* Events Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => <Card key={event.id} className="group overflow-hidden bg-card border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {event.featured && <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Destacado
                  </span>}
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <Button onClick={() => {
              setSelectedEvent(event);
              setGalleryIndex(0);
            }} className="w-full bg-hasace-red hover:bg-hasace-red/30 text-primary-foreground font-semibold">
                  Ver Galería
                </Button>
              </CardContent>
            </Card>)}
        </div>
      </div>

      {/* Event Gallery Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && <div className="space-y-6">
              {/* Image Gallery */}
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                  <img src={selectedEvent.images[galleryIndex]} alt={`${selectedEvent.title} - Imagen ${galleryIndex + 1}`} className="w-full h-full object-cover" />
                </div>
                
                {/* Gallery Navigation */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <Button variant="secondary" size="icon" onClick={prevGalleryImage} className="rounded-full bg-background/80 hover:bg-background shadow-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={nextGalleryImage} className="rounded-full bg-background/80 hover:bg-background shadow-lg">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm font-medium">
                  {galleryIndex + 1} / {selectedEvent.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 justify-center">
                {selectedEvent.images.map((img, idx) => <button key={idx} onClick={() => setGalleryIndex(idx)} className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === galleryIndex ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>)}
              </div>

              {/* Event Details */}
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
            </div>}
        </DialogContent>
      </Dialog>
    </section>;
};
export default EventsSection;
