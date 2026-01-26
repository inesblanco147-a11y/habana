import { ShoppingCart, Check, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/mockData";
import productDefaultImage from "@/assets/product-default.jpg";

const ProductsSection = () => {
  const { theme } = useTheme();

  const getSectionStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-background";
      case "modern":
        return "bg-muted/20";
      case "warm":
        return "bg-secondary/30";
      default:
        return "bg-background";
    }
  };

  const getTitleStyles = () => {
    switch (theme) {
      case "corporate":
        return "text-primary font-serif";
      case "modern":
        return "text-foreground font-bold";
      case "warm":
        return "text-hasace-green font-semibold";
      default:
        return "text-primary font-serif";
    }
  };

  const getCardStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-card border-border hover:shadow-lg transition-all";
      case "modern":
        return "bg-card border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all";
      case "warm":
        return "bg-card/80 border-border/50 rounded-2xl hover:shadow-md transition-all";
      default:
        return "bg-card border-border hover:shadow-lg transition-all";
    }
  };

  const getButtonStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-primary hover:bg-primary/90";
      case "modern":
        return "bg-hasace-red hover:bg-hasace-red/90 font-bold";
      case "warm":
        return "bg-hasace-green hover:bg-hasace-green/90";
      default:
        return "bg-primary hover:bg-primary/90";
    }
  };

  const getCategoryBadgeStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-primary/10 text-primary";
      case "modern":
        return "bg-hasace-red/10 text-hasace-red border-hasace-red/20";
      case "warm":
        return "bg-hasace-green/10 text-hasace-green border-hasace-green/20";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN"
    }).format(price);
  };

  const handleWhatsApp = (productName: string) => {
    const message = encodeURIComponent(`Hola, me interesa el producto: ${productName}. ¿Está disponible?`);
    window.open(`https://wa.me/524421234567?text=${message}`, "_blank");
  };

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <section id="store" className={`py-16 lg:py-24 ${getSectionStyles()}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
          <h2 className={`text-3xl lg:text-4xl mb-4 ${getTitleStyles()}`}>
            Tienda
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Productos y equipamiento de rehabilitación de alta calidad para tu recuperación
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Badge variant="outline" className={`cursor-pointer ${getCategoryBadgeStyles()}`}>
            Todos
          </Badge>
          {categories.map(category => (
            <Badge 
              key={category} 
              variant="outline" 
              className={`cursor-pointer hover:bg-muted ${getCategoryBadgeStyles()}`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <Card key={product.id} className={getCardStyles()}>
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={product.image || productDefaultImage}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.featured && (
                    <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                      Destacado
                    </Badge>
                  )}
                  <Badge 
                    variant="outline" 
                    className={`absolute top-3 right-3 ${
                      product.inStock 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
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
                <Badge variant="outline" className={`mb-2 text-xs ${getCategoryBadgeStyles()}`}>
                  {product.category}
                </Badge>
                <h3 className={`font-semibold mb-2 line-clamp-2 ${getTitleStyles()}`}>
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>
                <p className="text-xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleWhatsApp(product.name)}
                  disabled={!product.inStock}
                  className={`w-full ${getButtonStyles()}`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? "Consultar" : "No disponible"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            ¿No encuentras lo que buscas? Contáctanos para pedidos especiales
          </p>
          <Button
            variant="outline"
            onClick={() => {
              const message = encodeURIComponent("Hola, estoy buscando un producto específico para rehabilitación.");
              window.open(`https://wa.me/524421234567?text=${message}`, "_blank");
            }}
          >
            Consultar por WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
