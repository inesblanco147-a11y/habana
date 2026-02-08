import { useState } from "react";
import { ShoppingCart, Check, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";
import { Product } from "@/types/product";
import productDefaultImage from "@/assets/product-default.jpg";

const ProductsSection = () => {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useProductCategories();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("todos");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  const handleWhatsApp = (productName: string) => {
    const message = encodeURIComponent(`Hola, me interesa el producto: ${productName}. ¿Está disponible?`);
    window.open(`https://wa.me/524427981962?text=${message}`, "_blank");
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = categoryFilter === "todos"
    ? products
    : products.filter((p) => p.category === categoryFilter);

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

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={categoryFilter === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("todos")}
            className={categoryFilter === "todos" ? "bg-hasace-red hover:bg-hasace-red/90" : ""}
          >
            Todos
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={categoryFilter === cat.name ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat.name)}
              className={categoryFilter === cat.name ? "bg-hasace-red hover:bg-hasace-red/90" : ""}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-card border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={product.image || productDefaultImage}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.featured && (
                    <Badge className="absolute top-3 left-3 bg-amber-500 text-white">Destacado</Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`absolute top-3 right-3 ${product.inStock ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}
                  >
                    {product.inStock ? (
                      <>
                        <Check className="h-3 w-3 mr-1" /> En stock
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" /> Agotado
                      </>
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
                {/* Sizes */}
                {product.hasSizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.sizes.map((size, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className={
                          size.inStock
                            ? "bg-green-100 text-green-800 border-green-200 text-xs"
                            : "bg-red-100 text-red-800 border-red-200 text-xs line-through"
                        }
                      >
                        {size.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => openProductModal(product)}
                  className="w-full bg-hasace-red hover:bg-hasace-red/90 font-bold"
                >
                  Ver más
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
              window.open(`https://wa.me/524427981962?text=${message}`, "_blank");
            }}
            className="border-hasace-red text-hasace-red hover:bg-hasace-red hover:text-white"
          >
            Consultar por WhatsApp
          </Button>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline" className="bg-hasace-red/10 text-hasace-red border-hasace-red/20">
                    {selectedProduct.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      selectedProduct.inStock
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {selectedProduct.inStock ? "En stock" : "Agotado"}
                  </Badge>
                </div>
                <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription>{selectedProduct.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedProduct.image || productDefaultImage}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.showPrice && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Precio</p>
                    <p className="text-3xl font-bold text-hasace-red">{formatPrice(selectedProduct.price)}</p>
                  </div>
                )}
                {selectedProduct.hasSizes && selectedProduct.sizes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tallas disponibles</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={
                            size.inStock
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200 line-through"
                          }
                        >
                          {size.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-2">Descripción del producto</h4>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleWhatsApp(selectedProduct.name)}
                    disabled={!selectedProduct.inStock}
                    className="flex-1 gap-2 bg-hasace-red hover:bg-hasace-red/90 font-bold"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {selectedProduct.inStock ? "Consultar por WhatsApp" : "No disponible"}
                  </Button>
                </div>
                {!selectedProduct.inStock && (
                  <p className="text-center text-sm text-muted-foreground">
                    Este producto no está disponible actualmente. Contáctanos para conocer la fecha de reposición.
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProductsSection;
