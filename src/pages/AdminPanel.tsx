import { useState } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  GraduationCap, 
  ShoppingBag,
  ArrowLeft,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { upcomingCourses, products } from "@/data/mockData";
import { Course } from "@/types/course";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("courses");
  
  // Courses state
  const [coursesData, setCoursesData] = useState(upcomingCourses);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  
  // Products state
  const [productsData, setProductsData] = useState(products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN"
    }).format(price);
  };

  // Course handlers
  const handleAddCourse = () => {
    setEditingCourse({
      id: Date.now().toString(),
      title: "",
      description: "",
      image: "",
      modality: "presencial",
      availability: "disponible",
      date: "",
      duration: "",
      location: "",
      price: 0,
      instructor: "",
      objectives: [],
      includes: [],
      maxParticipants: 20,
      currentParticipants: 0
    });
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = () => {
    if (!editingCourse) return;

    const exists = coursesData.find(c => c.id === editingCourse.id);
    if (exists) {
      setCoursesData(coursesData.map(c => c.id === editingCourse.id ? editingCourse : c));
      toast({ title: "Curso actualizado", description: "Los cambios se han guardado correctamente." });
    } else {
      setCoursesData([...coursesData, editingCourse]);
      toast({ title: "Curso creado", description: "El nuevo curso se ha agregado correctamente." });
    }
    setIsCourseModalOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    setCoursesData(coursesData.filter(c => c.id !== id));
    toast({ title: "Curso eliminado", description: "El curso se ha eliminado correctamente." });
  };

  // Product handlers
  const handleAddProduct = () => {
    setEditingProduct({
      id: Date.now().toString(),
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      inStock: true,
      featured: false
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    const exists = productsData.find(p => p.id === editingProduct.id);
    if (exists) {
      setProductsData(productsData.map(p => p.id === editingProduct.id ? editingProduct : p));
      toast({ title: "Producto actualizado", description: "Los cambios se han guardado correctamente." });
    } else {
      setProductsData([...productsData, editingProduct]);
      toast({ title: "Producto creado", description: "El nuevo producto se ha agregado correctamente." });
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProductsData(productsData.filter(p => p.id !== id));
    toast({ title: "Producto eliminado", description: "El producto se ha eliminado correctamente." });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al sitio
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona los cursos y productos de HASACE</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cursos</p>
                  <p className="text-2xl font-bold">{coursesData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-hasace-green/10 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-hasace-green" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Productos</p>
                  <p className="text-2xl font-bold">{productsData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-hasace-red/10 rounded-lg">
                  <Users className="h-6 w-6 text-hasace-red" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Productos en Stock</p>
                  <p className="text-2xl font-bold">{productsData.filter(p => p.inStock).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList>
                  <TabsTrigger value="courses" className="gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Cursos
                  </TabsTrigger>
                  <TabsTrigger value="products" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Productos
                  </TabsTrigger>
                </TabsList>
                
                <Button onClick={activeTab === "courses" ? handleAddCourse : handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar {activeTab === "courses" ? "Curso" : "Producto"}
                </Button>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Courses Tab */}
              <TabsContent value="courses">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Modalidad</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Disponibilidad</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coursesData.map(course => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {course.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{course.modality}</Badge>
                          </TableCell>
                          <TableCell>{course.date}</TableCell>
                          <TableCell>{formatPrice(course.price)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={course.availability === "disponible" ? "default" : "secondary"}
                            >
                              {course.availability}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Destacado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsData.map(product => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {product.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>
                            <Badge variant={product.inStock ? "default" : "destructive"}>
                              {product.inStock ? "En stock" : "Agotado"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.featured && <Badge className="bg-amber-500">Sí</Badge>}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Course Modal */}
      <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse?.title ? "Editar Curso" : "Nuevo Curso"}
            </DialogTitle>
            <DialogDescription>
              Complete la información del curso
            </DialogDescription>
          </DialogHeader>
          
          {editingCourse && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={editingCourse.description}
                  onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidad</Label>
                  <Select 
                    value={editingCourse.modality}
                    onValueChange={value => setEditingCourse({...editingCourse, modality: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilidad</Label>
                  <Select 
                    value={editingCourse.availability}
                    onValueChange={value => setEditingCourse({...editingCourse, availability: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="ultimos-lugares">Últimos lugares</SelectItem>
                      <SelectItem value="agotado">Agotado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingCourse.date}
                    onChange={e => setEditingCourse({...editingCourse, date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración</Label>
                  <Input
                    id="duration"
                    value={editingCourse.duration}
                    placeholder="ej: 24 horas"
                    onChange={e => setEditingCourse({...editingCourse, duration: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={editingCourse.location}
                    onChange={e => setEditingCourse({...editingCourse, location: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (MXN)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingCourse.price}
                    onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={editingCourse.instructor}
                  onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCourse}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct?.name ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
            <DialogDescription>
              Complete la información del producto
            </DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prodDescription">Descripción</Label>
                <Textarea
                  id="prodDescription"
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prodPrice">Precio (MXN)</Label>
                  <Input
                    id="prodPrice"
                    type="number"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingProduct.inStock}
                    onCheckedChange={checked => setEditingProduct({...editingProduct, inStock: checked})}
                  />
                  <Label>En stock</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingProduct.featured}
                    onCheckedChange={checked => setEditingProduct({...editingProduct, featured: checked})}
                  />
                  <Label>Destacado</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminPanel;
