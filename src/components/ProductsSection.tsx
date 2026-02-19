import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import productDefaultImage from "@/assets/product-default.jpg";

const ProductsSection = () => {
  const { data: products = [], isLoading } = useProducts();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  // Show featured first, then fill up to 6
  const featured = products.filter(p => p.featured);
  const displayProducts = featured.length >= 6
    ? featured.slice(0, 6)
    : [...featured, ...products.filter(p => !p.featured)].slice(0, 6);

  return (
    <section id="products" className="py-16 lg:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">Productos</h2>
          <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Productos y equipamiento de rehabilitación de alta calidad para tu recuperación
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-card border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <ProductImageCarousel
                    images={product.images}
                    fallbackImage={product.image || productDefaultImage}
                    alt={product.name}
                  />
                  {product.featured && (
                    <Badge className="absolute top-3 left-3 bg-amber-500 text-white z-10">Destacado</Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`absolute top-3 right-3 z-10 ${product.inStock ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}
                  >
                    {product.inStock ? (
                      <><Check className="h-3 w-3 mr-1" /> En stock</>
                    ) : (
                      <><X className="h-3 w-3 mr-1" /> Agotado</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Badge variant="outline" className="mb-2 text-xs bg-hasace-red/10 text-hasace-red border-hasace-red/20">
                  {product.category}
                </Badge>
                <h3 className="font-bold mb-2 line-clamp-2 text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                {product.showPrice && <p className="text-xl font-bold text-hasace-red">{formatPrice(product.price)}</p>}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to="/productos/catalogo" className="w-full">
                  <Button className="w-full bg-hasace-red hover:bg-hasace-red/90 font-bold">
                    Ver más
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to="/productos/catalogo">
            <Button size="lg" className="bg-hasace-red hover:bg-hasace-red/90 font-bold gap-2 px-8">
              Ver todos los productos
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
