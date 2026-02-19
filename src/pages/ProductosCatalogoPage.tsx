import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Check, X, MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";
import { Product } from "@/types/product";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import productDefaultImage from "@/assets/product-default.jpg";
import PageLayout from "@/components/PageLayout";

type SortOption = "name" | "price-asc" | "price-desc" | "category";

const ProductosCatalogoPage = () => {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useProductCategories();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  const handleWhatsApp = (product: Product) => {
    const message = encodeURIComponent(
      `¡Hola! Me interesa el producto: *${product.name}*\n` +
      (product.showPrice ? `💰 Precio: ${formatPrice(product.price)}\n` : "") +
      `📦 Categoría: ${product.category}\n\n¿Está disponible?`
    );
    window.open(`https://wa.me/524422137365?text=${message}`, "_blank");
  };

  const filteredAndSorted = useMemo(() => {
    let result = products;
    if (categoryFilter !== "todos") {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "name": return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case "price-asc": return [...result].sort((a, b) => a.price - b.price);
      case "price-desc": return [...result].sort((a, b) => b.price - a.price);
      case "category": return [...result].sort((a, b) => a.category.localeCompare(b.category));
      default: return result;
    }
  }, [products, categoryFilter, searchQuery, sortBy]);

  const [modalImageIndex, setModalImageIndex] = useState(0);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setModalImageIndex(0);
    setIsModalOpen(true);
  };

  const modalImages = selectedProduct
    ? (selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.image || productDefaultImage])
    : [];

  return (
    <PageLayout>
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">Catálogo de Productos</h1>
            <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Explora nuestra línea completa de productos de rehabilitación y ortopedia
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full md:w-48">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                <SelectItem value="category">Categoría</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={categoryFilter === "todos" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("todos")}
              className={categoryFilter === "todos" ? "bg-hasace-red hover:bg-hasace-red/90" : ""}
            >
              Todos
            </Button>
            {categories.map(cat => (
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

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            {filteredAndSorted.length} producto{filteredAndSorted.length !== 1 ? "s" : ""} encontrado{filteredAndSorted.length !== 1 ? "s" : ""}
          </p>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map(product => (
              <Card key={product.id} className="bg-card border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden">
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
                      {product.inStock ? <><Check className="h-3 w-3 mr-1" /> En stock</> : <><X className="h-3 w-3 mr-1" /> Agotado</>}
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
                  <Button onClick={() => openProductModal(product)} className="w-full bg-hasace-red hover:bg-hasace-red/90 font-bold">
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredAndSorted.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No se encontraron productos</p>
              <Button variant="outline" className="mt-4" onClick={() => { setCategoryFilter("todos"); setSearchQuery(""); }}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline" className="bg-hasace-red/10 text-hasace-red border-hasace-red/20">
                    {selectedProduct.category}
                  </Badge>
                  <Badge variant="outline" className={selectedProduct.inStock ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                    {selectedProduct.inStock ? "En stock" : "Agotado"}
                  </Badge>
                </div>
                <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription>{selectedProduct.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Image Gallery */}
                <div className="space-y-2">
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                    <img
                      src={modalImages[modalImageIndex] || productDefaultImage}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover cursor-zoom-in"
                    />
                  </div>
                  {modalImages.length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {modalImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setModalImageIndex(i)}
                          className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${i === modalImageIndex ? "border-hasace-red" : "border-transparent opacity-60 hover:opacity-100"}`}
                        >
                          <img src={img} alt={`${selectedProduct.name} ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
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
                        <Badge key={idx} variant="outline" className={size.inStock ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200 line-through"}>
                          {size.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {Object.keys(selectedProduct.specifications).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Especificaciones</h4>
                    <div className="border rounded-lg divide-y">
                      {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between px-4 py-2 text-sm">
                          <span className="font-medium text-muted-foreground">{key}</span>
                          <span>{value}</span>
                        </div>
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
                    onClick={() => handleWhatsApp(selectedProduct)}
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
    </PageLayout>
  );
};

export default ProductosCatalogoPage;
