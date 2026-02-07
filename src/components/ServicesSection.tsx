import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/hooks/useServices";
import { Tag } from "lucide-react";

const ServicesSection = () => {
  const { data: services = [], isLoading } = useServices();

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);
  const calculateDiscountedPrice = (price: number, discount: number) => price - (price * discount) / 100;

  if (isLoading) {
    return (
      <section id="servicios" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-96 rounded-xl" />)}
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section id="servicios" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">Nuestros Servicios</h2>
          <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
          <p className="max-w-2xl mx-auto text-muted-foreground">Descubre nuestra amplia gama de servicios especializados en rehabilitación física y medicina deportiva</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={service.image || "/placeholder.svg"} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {service.offerActive && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-hasace-red text-white font-bold gap-1 px-3 py-1 shadow-lg"><Tag className="h-3 w-3" />Oferta del Mes</Badge>
                  </div>
                )}
                {service.offerActive && service.discount > 0 && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-green-500 text-white font-bold shadow-lg">-{service.discount}%</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-3 text-xs">{service.category}</Badge>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-hasace-red transition-colors">{service.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{service.description}</p>
                {service.offerActive && service.offerDescription && (
                  <p className="text-hasace-red text-sm font-medium mb-4 italic">{service.offerDescription}</p>
                )}
                {service.showPrice && (
                  <div className="flex items-center gap-3">
                    {service.offerActive && service.discount > 0 ? (
                      <>
                        <span className="text-muted-foreground line-through text-lg">{formatPrice(service.price)}</span>
                        <span className="text-2xl font-bold text-hasace-red">{formatPrice(calculateDiscountedPrice(service.price, service.discount))}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-primary">{formatPrice(service.price)}</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
