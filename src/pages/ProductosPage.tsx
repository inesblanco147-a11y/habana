import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";
import productDefaultImage from "@/assets/product-default.jpg";
import PageLayout from "@/components/PageLayout";

const ProductosPage = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useProductCategories();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const displayProducts = featuredProducts.length >= 3 ? featuredProducts : products.slice(0, 3);

  const getProductImage = (product: (typeof products)[0]) => {
    if (product.images.length > 0) return product.images[product.mainImageIndex] || product.images[0];
    return product.image || productDefaultImage;
  };

  return (
    <PageLayout>
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">
              Nuestros Productos
            </h1>
            <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              Equipamiento y productos de rehabilitación de alta calidad para apoyar tu proceso de recuperación
            </p>
          </div>

          {/* Featured Images Grid */}
          {displayProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {displayProducts.map((product) => (
                <div key={product.id} className="relative group overflow-hidden rounded-lg shadow-xl">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div>
                      <Badge className="bg-hasace-red text-white mb-2">{product.category}</Badge>
                      <h3 className="text-white font-bold text-lg">{product.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Introduction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-24">
            <div className="bg-card p-8 border-b-2 border-hasace-red">
              <h2 className="text-2xl lg:text-3xl mb-6 text-hasace-red font-bold uppercase tracking-wide">
                Productos para tu Recuperación
              </h2>
              <p className="text-base lg:text-lg leading-relaxed text-primary mb-4">
                ¡Mejora tu bienestar hoy! Tenemos artículos que ayudan a inmovilizar, proteger, estabilizar y mucho más.
                Ve todo los productos que tenemos para ti, ¡Vive sin dolor!
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Desde equipos de electroterapia hasta productos ortopédicos especializados, encontrarás todo lo que
                necesitas para complementar tu tratamiento de rehabilitación.
              </p>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              {/* Benefits */}
              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-hasace-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Calidad Garantizada</h4>
                    <p className="text-sm text-muted-foreground">Productos seleccionados por nuestro equipo médico</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HeartHandshake className="h-6 w-6 text-hasace-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Asesoría Profesional</h4>
                    <p className="text-sm text-muted-foreground">Te orientamos para elegir el producto adecuado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-6 w-6 text-hasace-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Disponibilidad Inmediata</h4>
                    <p className="text-sm text-muted-foreground">Consulta stock y reserva por WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/productos/catalogo">
              <Button size="lg" className="bg-hasace-red hover:bg-hasace-red/90 text-lg px-8 py-6 font-bold gap-2">
                Explorar Catálogo Completo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ProductosPage;
