import { useState } from "react";
import { 
  Plus, Edit, Trash2, Save, GraduationCap, ShoppingBag, ArrowLeft, Calendar,
  Users, Loader2, LogOut, Settings, Sparkles, History, Image, Video as VideoIcon, Tag, ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Course, PastCourse, CourseModality, CourseAvailability } from "@/types/course";
import { Product, ProductSize } from "@/types/product";
import { Event } from "@/types/event";
import { Doctor } from "@/types/doctor";
import { Service } from "@/types/service";
import { GalleryItem } from "@/types/gallery";
import { Video } from "@/types/video";
import { useCourses, usePastCourses } from "@/hooks/useCourses";
import { useProducts } from "@/hooks/useProducts";
import { useEvents } from "@/hooks/useEvents";
import { useDoctors } from "@/hooks/useDoctors";
import { useServices } from "@/hooks/useServices";
import { useGallery } from "@/hooks/useGallery";
import { useVideos } from "@/hooks/useVideos";
import { useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/useCourseMutations";
import { useCreatePastCourse, useUpdatePastCourse, useDeletePastCourse } from "@/hooks/usePastCourseMutations";
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProductMutations";
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/useEventMutations";
import { useCreateDoctor, useUpdateDoctor, useDeleteDoctor } from "@/hooks/useDoctorMutations";
import { useCreateService, useUpdateService, useDeleteService } from "@/hooks/useServiceMutations";
import { useCreateGallery, useUpdateGallery, useDeleteGallery } from "@/hooks/useGalleryMutations";
import { useCreateVideo, useUpdateVideo, useDeleteVideo } from "@/hooks/useVideoMutations";
import { useProductCategories } from "@/hooks/useProductCategories";
import { useCreateProductCategory, useUpdateProductCategory, useDeleteProductCategory } from "@/hooks/useProductCategoryMutations";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteSettings";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import VideoUpload from "@/components/VideoUpload";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // Fetch data
  const { data: coursesData = [], isLoading: loadingCourses } = useCourses();
  const { data: pastCoursesData = [], isLoading: loadingPastCourses } = usePastCourses();
  const { data: productsData = [], isLoading: loadingProducts } = useProducts();
  const { data: eventsData = [], isLoading: loadingEvents } = useEvents();
  const { data: doctorsData = [], isLoading: loadingDoctors } = useDoctors();
  const { data: settingsData = [], isLoading: loadingSettings } = useSiteSettings();
  const { data: servicesData = [], isLoading: loadingServices } = useServices();
  const { data: galleryData = [], isLoading: loadingGallery } = useGallery();
  const { data: videosData = [], isLoading: loadingVideos } = useVideos();
  const { data: productCategoriesData = [] } = useProductCategories();

  // Mutations
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const createPastCourse = useCreatePastCourse();
  const updatePastCourse = useUpdatePastCourse();
  const deletePastCourse = useDeletePastCourse();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const createGallery = useCreateGallery();
  const updateGallery = useUpdateGallery();
  const deleteGallery = useDeleteGallery();
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideoMut = useDeleteVideo();
  const createProductCategory = useCreateProductCategory();
  const updateProductCategoryMut = useUpdateProductCategory();
  const deleteProductCategoryMut = useDeleteProductCategory();
  const updateSetting = useUpdateSiteSetting();
  
  // Modal states
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingPastCourse, setEditingPastCourse] = useState<PastCourse | null>(null);
  const [isPastCourseModalOpen, setIsPastCourseModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});
  const [newSizeName, setNewSizeName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast({ variant: "destructive", title: "Error", description: "No se pudo cerrar sesión." });
        setIsLoggingOut(false);
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Ocurrió un error al cerrar sesión." });
      setIsLoggingOut(false);
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  const getSettingValue = (key: string) => editingSettings[key] !== undefined ? editingSettings[key] : settingsData.find(s => s.key === key)?.value || "";
  const handleSettingChange = (key: string, value: string) => setEditingSettings(prev => ({ ...prev, [key]: value }));
  const handleSaveSettings = async () => {
    try {
      for (const [key, value] of Object.entries(editingSettings)) {
        await updateSetting.mutateAsync({ key, value });
      }
      setEditingSettings({});
      toast({ title: "Configuración guardada", description: "Los cambios se han guardado correctamente." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la configuración." });
    }
  };

  // Course handlers
  const handleAddCourse = () => {
    setEditingCourse({ id: "", title: "", description: "", image: "", modality: "presencial", availability: "disponible", date: "", duration: "", location: "", price: 0, instructor: "", objectives: [], includes: [], maxParticipants: 20, currentParticipants: 0, showDate: true, showDuration: true, showParticipants: true, showObjectives: true, showIncludes: true, showPrice: true, showLocation: true });
    setIsCourseModalOpen(true);
  };
  const handleEditCourse = (course: Course) => { setEditingCourse({ ...course }); setIsCourseModalOpen(true); };
  const handleSaveCourse = () => {
    if (!editingCourse) return;
    const closeModal = () => { setIsCourseModalOpen(false); setEditingCourse(null); };
    if (editingCourse.id) { updateCourse.mutate(editingCourse, { onSuccess: closeModal, onError: () => {} }); }
    else { const { id, ...d } = editingCourse; createCourse.mutate(d, { onSuccess: closeModal, onError: () => {} }); }
  };

  // Product handlers
  const handleAddProduct = () => {
    setEditingProduct({ id: "", name: "", description: "", price: 0, image: "", category: "", inStock: true, featured: false, showPrice: true, hasSizes: false, sizes: [] });
    setIsProductModalOpen(true);
  };
  const handleEditProduct = (product: Product) => { setEditingProduct({ ...product }); setIsProductModalOpen(true); };
  const handleSaveProduct = () => {
    if (!editingProduct) return;
    const closeModal = () => { setIsProductModalOpen(false); setEditingProduct(null); };
    if (editingProduct.id) { updateProduct.mutate(editingProduct, { onSuccess: closeModal, onError: () => {} }); }
    else { const { id, ...d } = editingProduct; createProduct.mutate(d, { onSuccess: closeModal, onError: () => {} }); }
  };

  // Event handlers
  const handleAddEvent = () => { setEditingEvent({ id: "", title: "", description: "", date: "", location: "", images: [], featured: false, showDate: true, showLocation: true }); setIsEventModalOpen(true); };
  const handleEditEvent = (event: Event) => { setEditingEvent({ ...event }); setIsEventModalOpen(true); };
  const handleSaveEvent = () => {
    if (!editingEvent) return;
    const closeModal = () => { setIsEventModalOpen(false); setEditingEvent(null); };
    if (editingEvent.id) { updateEvent.mutate(editingEvent, { onSuccess: closeModal, onError: () => {} }); }
    else { const { id, ...d } = editingEvent; createEvent.mutate(d, { onSuccess: closeModal, onError: () => {} }); }
  };

  // Doctor handlers
  const handleAddDoctor = () => { setEditingDoctor({ id: "", name: "", title: "", specialty: "", summary: "", experience: "", education: [], certifications: [], image: "" }); setIsDoctorModalOpen(true); };
  const handleEditDoctor = (doctor: Doctor) => { setEditingDoctor({ ...doctor }); setIsDoctorModalOpen(true); };
  const handleSaveDoctor = () => {
    if (!editingDoctor) return;
    const closeModal = () => { setIsDoctorModalOpen(false); setEditingDoctor(null); };
    if (editingDoctor.id) { updateDoctor.mutate(editingDoctor, { onSuccess: closeModal, onError: () => {} }); }
    else { const { id, ...d } = editingDoctor; createDoctor.mutate(d, { onSuccess: closeModal, onError: () => {} }); }
  };

  // Service handlers
  const handleAddService = () => { setEditingService({ id: "", name: "", description: "", image: "", price: 0, discount: 0, offerActive: false, offerDescription: "", category: "", showPrice: true }); setIsServiceModalOpen(true); };
  const handleEditService = (service: Service) => { setEditingService({ ...service }); setIsServiceModalOpen(true); };
  const handleSaveService = () => {
    if (!editingService) return;
    const closeModal = () => { setIsServiceModalOpen(false); setEditingService(null); };
    if (editingService.id) { updateService.mutate(editingService, { onSuccess: closeModal, onError: () => {} }); }
    else { const { id, ...d } = editingService; createService.mutate(d, { onSuccess: closeModal, onError: () => {} }); }
  };

  // Past Course handlers
  const handleAddPastCourse = () => { setEditingPastCourse({ id: "", title: "", description: "", image: "", modality: "presencial", date: "", participants: 0, instructor: "", galleryImages: [] }); setIsPastCourseModalOpen(true); };
  const handleEditPastCourse = (course: PastCourse) => { setEditingPastCourse({ ...course }); setIsPastCourseModalOpen(true); };
  const handleSavePastCourse = () => {
    if (!editingPastCourse) return;
    const closeModal = () => { setIsPastCourseModalOpen(false); setEditingPastCourse(null); };
    if (editingPastCourse.id) { updatePastCourse.mutate(editingPastCourse, { onSuccess: closeModal, onError: () => {} }); }
    else { const { id, ...d } = editingPastCourse; createPastCourse.mutate(d, { onSuccess: closeModal, onError: () => {} }); }
  };

  // Gallery handlers
  const handleAddGallery = () => { setEditingGallery({ id: "", title: "", description: "", images: [] }); setIsGalleryModalOpen(true); };
  const handleEditGallery = (item: GalleryItem) => { setEditingGallery({ ...item }); setIsGalleryModalOpen(true); };
  const handleSaveGallery = () => {
    if (!editingGallery) return;
    const closeModal = () => { setIsGalleryModalOpen(false); setEditingGallery(null); };
    if (editingGallery.id) { updateGallery.mutate(editingGallery, { onSuccess: closeModal, onError: () => {} }); }
    else { const { id, ...d } = editingGallery; createGallery.mutate(d, { onSuccess: closeModal, onError: () => {} }); }
  };

  // Video handlers
  const handleAddVideo = () => { setEditingVideo({ id: "", title: "", description: "", thumbnail: "", videoUrl: "" }); setIsVideoModalOpen(true); };
  const handleEditVideo = (video: Video) => { setEditingVideo({ ...video }); setIsVideoModalOpen(true); };
  const handleSaveVideo = () => {
    if (!editingVideo) return;
    const closeModal = () => { setIsVideoModalOpen(false); setEditingVideo(null); };
    if (editingVideo.id) { updateVideo.mutate(editingVideo, { onSuccess: closeModal, onError: () => {} }); }
    else { const { id, ...d } = editingVideo; createVideo.mutate(d, { onSuccess: closeModal, onError: () => {} }); }
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    switch (deleteConfirm.type) {
      case "course": deleteCourse.mutate(deleteConfirm.id); break;
      case "product": deleteProduct.mutate(deleteConfirm.id); break;
      case "event": deleteEvent.mutate(deleteConfirm.id); break;
      case "doctor": deleteDoctor.mutate(deleteConfirm.id); break;
      case "service": deleteService.mutate(deleteConfirm.id); break;
      case "past_course": deletePastCourse.mutate(deleteConfirm.id); break;
      case "gallery": deleteGallery.mutate(deleteConfirm.id); break;
      case "video": deleteVideoMut.mutate(deleteConfirm.id); break;
      case "category": deleteProductCategoryMut.mutate(deleteConfirm.id); break;
    }
    setDeleteConfirm(null);
  };

  const getAddHandler = () => {
    switch (activeTab) {
      case "courses": return handleAddCourse;
      case "past_courses": return handleAddPastCourse;
      case "products": return handleAddProduct;
      case "events": return handleAddEvent;
      case "doctors": return handleAddDoctor;
      case "services": return handleAddService;
      case "gallery": return handleAddGallery;
      case "videos": return handleAddVideo;
      default: return handleAddCourse;
    }
  };

  const getTabLabel = () => {
    const labels: Record<string, string> = { courses: "Curso", past_courses: "Curso Pasado", products: "Producto", events: "Evento", doctors: "Doctor", services: "Servicio", gallery: "Galería", videos: "Video" };
    return labels[activeTab] || "Item";
  };

  const isSaving = createCourse.isPending || updateCourse.isPending || createProduct.isPending || updateProduct.isPending || createEvent.isPending || updateEvent.isPending || createDoctor.isPending || updateDoctor.isPending || createService.isPending || updateService.isPending || createPastCourse.isPending || updatePastCourse.isPending || createVideo.isPending || updateVideo.isPending;

  const addSize = () => {
    if (!editingProduct || !newSizeName.trim()) return;
    setEditingProduct({ ...editingProduct, sizes: [...editingProduct.sizes, { name: newSizeName.trim(), inStock: true }] });
    setNewSizeName("");
  };

  const removeSize = (idx: number) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, sizes: editingProduct.sizes.filter((_, i) => i !== idx) });
  };

  const toggleSizeStock = (idx: number) => {
    if (!editingProduct) return;
    const newSizes = [...editingProduct.sizes];
    newSizes[idx] = { ...newSizes[idx], inStock: !newSizes[idx].inStock };
    setEditingProduct({ ...editingProduct, sizes: newSizes });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => window.history.back()}><ArrowLeft className="h-4 w-4 mr-2" />Volver al sitio</Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Cerrando...</> : <><LogOut className="h-4 w-4 mr-2" />Cerrar sesión</>}
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona los contenidos de HASACE</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 bg-primary/10 rounded-lg"><GraduationCap className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Cursos</p><p className="text-2xl font-bold">{coursesData.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 bg-accent/10 rounded-lg"><ShoppingBag className="h-6 w-6 text-accent" /></div><div><p className="text-sm text-muted-foreground">Productos</p><p className="text-2xl font-bold">{productsData.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 bg-destructive/10 rounded-lg"><Calendar className="h-6 w-6 text-destructive" /></div><div><p className="text-sm text-muted-foreground">Eventos</p><p className="text-2xl font-bold">{eventsData.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 bg-primary/10 rounded-lg"><Users className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Doctores</p><p className="text-2xl font-bold">{doctorsData.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 bg-hasace-red/10 rounded-lg"><Sparkles className="h-6 w-6 text-hasace-red" /></div><div><p className="text-sm text-muted-foreground">Servicios</p><p className="text-2xl font-bold">{servicesData.length}</p></div></div></CardContent></Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList className="flex-wrap h-auto">
                  <TabsTrigger value="courses" className="gap-2"><GraduationCap className="h-4 w-4" /><span className="hidden sm:inline">Cursos</span></TabsTrigger>
                  <TabsTrigger value="past_courses" className="gap-2"><History className="h-4 w-4" /><span className="hidden sm:inline">Cursos Pasados</span></TabsTrigger>
                  <TabsTrigger value="products" className="gap-2"><ShoppingBag className="h-4 w-4" /><span className="hidden sm:inline">Productos</span></TabsTrigger>
                  <TabsTrigger value="events" className="gap-2"><Calendar className="h-4 w-4" /><span className="hidden sm:inline">Eventos</span></TabsTrigger>
                  <TabsTrigger value="doctors" className="gap-2"><Users className="h-4 w-4" /><span className="hidden sm:inline">Doctores</span></TabsTrigger>
                  <TabsTrigger value="services" className="gap-2"><Sparkles className="h-4 w-4" /><span className="hidden sm:inline">Servicios</span></TabsTrigger>
                  <TabsTrigger value="gallery" className="gap-2"><Image className="h-4 w-4" /><span className="hidden sm:inline">Galería</span></TabsTrigger>
                  <TabsTrigger value="videos" className="gap-2"><VideoIcon className="h-4 w-4" /><span className="hidden sm:inline">Videos</span></TabsTrigger>
                  <TabsTrigger value="appointments" className="gap-2"><ClipboardList className="h-4 w-4" /><span className="hidden sm:inline">Citas</span></TabsTrigger>
                  <TabsTrigger value="categories" className="gap-2"><Tag className="h-4 w-4" /><span className="hidden sm:inline">Categorías</span></TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /><span className="hidden sm:inline">Configuración</span></TabsTrigger>
                </TabsList>
                {activeTab !== "settings" && activeTab !== "categories" && activeTab !== "appointments" && (
                  <Button onClick={getAddHandler()}><Plus className="h-4 w-4 mr-2" />Agregar {getTabLabel()}</Button>
                )}
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Courses Tab */}
              <TabsContent value="courses">
                {loadingCourses ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                  <div className="overflow-x-auto"><Table><TableHeader><TableRow>
                    <TableHead>Título</TableHead><TableHead>Modalidad</TableHead><TableHead>Fecha</TableHead><TableHead>Precio</TableHead><TableHead>Disponibilidad</TableHead><TableHead className="text-right">Acciones</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {coursesData.map(course => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{course.title}</TableCell>
                        <TableCell><Badge variant="outline">{course.modality}</Badge></TableCell>
                        <TableCell>{course.date}</TableCell>
                        <TableCell>{formatPrice(course.price)}</TableCell>
                        <TableCell><Badge variant={course.availability === "disponible" ? "default" : "secondary"}>{course.availability}</Badge></TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditCourse(course)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm({ type: "course", id: course.id, name: course.title })}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table></div>
                )}
              </TabsContent>

              {/* Past Courses Tab */}
              <TabsContent value="past_courses">
                {loadingPastCourses ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                  <div className="overflow-x-auto"><Table><TableHeader><TableRow>
                    <TableHead>Título</TableHead><TableHead>Modalidad</TableHead><TableHead>Fecha</TableHead><TableHead>Participantes</TableHead><TableHead className="text-right">Acciones</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {pastCoursesData.map(course => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{course.title}</TableCell>
                        <TableCell><Badge variant="outline">{course.modality}</Badge></TableCell>
                        <TableCell>{course.date}</TableCell>
                        <TableCell>{course.participants}</TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditPastCourse(course)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm({ type: "past_course", id: course.id, name: course.title })}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table></div>
                )}
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products">
                {loadingProducts ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                  <div className="overflow-x-auto"><Table><TableHeader><TableRow>
                    <TableHead>Nombre</TableHead><TableHead>Categoría</TableHead><TableHead>Precio</TableHead><TableHead>Stock</TableHead><TableHead>Destacado</TableHead><TableHead className="text-right">Acciones</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {productsData.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                        <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell><Badge variant={product.inStock ? "default" : "destructive"}>{product.inStock ? "En stock" : "Agotado"}</Badge></TableCell>
                        <TableCell>{product.featured && <Badge variant="secondary" className="bg-accent text-accent-foreground">Sí</Badge>}</TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditProduct(product)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm({ type: "product", id: product.id, name: product.name })}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table></div>
                )}
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events">
                {loadingEvents ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                  <div className="overflow-x-auto"><Table><TableHeader><TableRow>
                    <TableHead>Título</TableHead><TableHead>Fecha</TableHead><TableHead>Ubicación</TableHead><TableHead>Imágenes</TableHead><TableHead>Destacado</TableHead><TableHead className="text-right">Acciones</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {eventsData.map(event => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{event.title}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell><Badge variant="outline">{event.images.length} imgs</Badge></TableCell>
                        <TableCell>{event.featured && <Badge variant="secondary" className="bg-accent text-accent-foreground">Sí</Badge>}</TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditEvent(event)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm({ type: "event", id: event.id, name: event.title })}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table></div>
                )}
              </TabsContent>

              {/* Doctors Tab */}
              <TabsContent value="doctors">
                {loadingDoctors ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                  <div className="overflow-x-auto"><Table><TableHeader><TableRow>
                    <TableHead>Nombre</TableHead><TableHead>Título</TableHead><TableHead>Especialidad</TableHead><TableHead>Experiencia</TableHead><TableHead className="text-right">Acciones</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {doctorsData.map(doctor => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{doctor.name}</TableCell>
                        <TableCell>{doctor.title}</TableCell>
                        <TableCell><Badge variant="outline">{doctor.specialty}</Badge></TableCell>
                        <TableCell>{doctor.experience}</TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditDoctor(doctor)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm({ type: "doctor", id: doctor.id, name: doctor.name })}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table></div>
                )}
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services">
                {loadingServices ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                  <div className="overflow-x-auto"><Table><TableHeader><TableRow>
                    <TableHead>Nombre</TableHead><TableHead>Categoría</TableHead><TableHead>Precio</TableHead><TableHead>Descuento</TableHead><TableHead>Oferta Activa</TableHead><TableHead className="text-right">Acciones</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {servicesData.map(service => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{service.name}</TableCell>
                        <TableCell><Badge variant="outline">{service.category}</Badge></TableCell>
                        <TableCell>{formatPrice(service.price)}</TableCell>
                        <TableCell>{service.discount > 0 && <Badge variant="secondary" className="bg-green-500/20 text-green-700">-{service.discount}%</Badge>}</TableCell>
                        <TableCell>{service.offerActive && <Badge className="bg-hasace-red text-white">Sí</Badge>}</TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditService(service)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm({ type: "service", id: service.id, name: service.name })}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table></div>
                )}
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery">
                {loadingGallery ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                  <div className="overflow-x-auto"><Table><TableHeader><TableRow>
                    <TableHead>Título</TableHead><TableHead>Descripción</TableHead><TableHead>Imágenes</TableHead><TableHead className="text-right">Acciones</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {galleryData.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{item.description}</TableCell>
                        <TableCell><Badge variant="outline">{item.images.length} fotos</Badge></TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditGallery(item)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm({ type: "gallery", id: item.id, name: item.title })}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table></div>
                )}
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos">
                {loadingVideos ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                  <div className="overflow-x-auto"><Table><TableHeader><TableRow>
                    <TableHead>Título</TableHead><TableHead>Descripción</TableHead><TableHead>URL</TableHead><TableHead className="text-right">Acciones</TableHead>
                  </TableRow></TableHeader><TableBody>
                    {videosData.map(video => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{video.title}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{video.description}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{video.videoUrl ? "✅ Video subido" : "Sin video"}</TableCell>
                        <TableCell className="text-right"><div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditVideo(video)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm({ type: "video", id: video.id, name: video.title })}><Trash2 className="h-4 w-4" /></Button>
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table></div>
                )}
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Agregar Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nombre de la categoría"
                          value={newCategoryName}
                          onChange={e => setNewCategoryName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter" && newCategoryName.trim()) {
                              e.preventDefault();
                              createProductCategory.mutate(newCategoryName.trim(), { onSuccess: () => setNewCategoryName("") });
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            if (newCategoryName.trim()) {
                              createProductCategory.mutate(newCategoryName.trim(), { onSuccess: () => setNewCategoryName("") });
                            }
                          }}
                          disabled={!newCategoryName.trim() || createProductCategory.isPending}
                        >
                          {createProductCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                          Agregar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productCategoriesData.map(cat => (
                        <TableRow key={cat.id}>
                          <TableCell>
                            {editingCategoryId === cat.id ? (
                              <Input
                                value={editingCategoryName}
                                onChange={e => setEditingCategoryName(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === "Enter") {
                                    updateProductCategoryMut.mutate({ id: cat.id, name: editingCategoryName.trim() }, { onSuccess: () => setEditingCategoryId(null) });
                                  }
                                }}
                              />
                            ) : (
                              <span className="font-medium">{cat.name}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {editingCategoryId === cat.id ? (
                                <Button size="sm" variant="ghost" onClick={() => {
                                  updateProductCategoryMut.mutate({ id: cat.id, name: editingCategoryName.trim() }, { onSuccess: () => setEditingCategoryId(null) });
                                }} disabled={updateProductCategoryMut.isPending}>
                                  <Save className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="ghost" onClick={() => { setEditingCategoryId(cat.id); setEditingCategoryName(cat.name); }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm({ type: "category", id: cat.id, name: cat.name })}>
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

              {/* Appointments Tab */}
              <TabsContent value="appointments">
                <AppointmentsTab />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                {loadingSettings ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
                  <div className="space-y-6">
                    <Card><CardHeader><CardTitle className="text-lg">Información de Contacto</CardTitle><CardDescription>Configura los datos de contacto que aparecen en el sitio</CardDescription></CardHeader>
                      <CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="contact_phone">Teléfono de contacto</Label><Input id="contact_phone" value={getSettingValue("contact_phone")} placeholder="+52 442 123 4567" onChange={e => handleSettingChange("contact_phone", e.target.value)} /></div>
                        <div className="space-y-2"><Label htmlFor="contact_email">Email de contacto</Label><Input id="contact_email" type="email" value={getSettingValue("contact_email")} placeholder="contacto@hasace.mx" onChange={e => handleSettingChange("contact_email", e.target.value)} /></div>
                      </div></CardContent>
                    </Card>
                    <Card><CardHeader><CardTitle className="text-lg">Integraciones</CardTitle><CardDescription>Configura WhatsApp y Google Calendar para los botones del sitio</CardDescription></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2"><Label htmlFor="whatsapp_number">Número de WhatsApp</Label><Input id="whatsapp_number" value={getSettingValue("whatsapp_number")} placeholder="521234567890" onChange={e => handleSettingChange("whatsapp_number", e.target.value)} /><p className="text-xs text-muted-foreground">Ingresa el número con código de país, sin espacios ni caracteres especiales.</p></div>
                        <div className="space-y-2"><Label htmlFor="google_calendar_url">URL de Google Calendar</Label><Input id="google_calendar_url" value={getSettingValue("google_calendar_url")} placeholder="https://calendar.google.com/calendar/..." onChange={e => handleSettingChange("google_calendar_url", e.target.value)} /><p className="text-xs text-muted-foreground">Pega aquí el enlace público de tu calendario de Google</p></div>
                      </CardContent>
                    </Card>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveSettings} disabled={Object.keys(editingSettings).length === 0 || updateSetting.isPending}>
                        {updateSetting.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Guardar Configuración
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Course Modal */}
      <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingCourse?.id ? "Editar Curso" : "Nuevo Curso"}</DialogTitle><DialogDescription>Complete la información del curso</DialogDescription></DialogHeader>
          {editingCourse && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Título</Label><Input value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea value={editingCourse.description} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Modalidad</Label><Select value={editingCourse.modality} onValueChange={v => setEditingCourse({...editingCourse, modality: v as CourseModality})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent className="bg-card"><SelectItem value="presencial">Presencial</SelectItem><SelectItem value="online">Online</SelectItem><SelectItem value="híbrido">Híbrido</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Disponibilidad</Label><Select value={editingCourse.availability} onValueChange={v => setEditingCourse({...editingCourse, availability: v as CourseAvailability})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent className="bg-card"><SelectItem value="disponible">Disponible</SelectItem><SelectItem value="ultimos-lugares">Últimos lugares</SelectItem><SelectItem value="agotado">Agotado</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Fecha</Label><Input value={editingCourse.date} placeholder="ej: 2025-03-15" onChange={e => setEditingCourse({...editingCourse, date: e.target.value})} /></div>
                <div className="space-y-2"><Label>Duración</Label><Input value={editingCourse.duration} placeholder="ej: 24 horas" onChange={e => setEditingCourse({...editingCourse, duration: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Ubicación</Label><Input value={editingCourse.location} onChange={e => setEditingCourse({...editingCourse, location: e.target.value})} /></div>
                <div className="space-y-2"><Label>Precio (MXN)</Label><Input type="number" value={editingCourse.price} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Instructor</Label><Input value={editingCourse.instructor} onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})} /></div>
                <div className="space-y-2"><Label>Máx. Participantes</Label><Input type="number" value={editingCourse.maxParticipants} onChange={e => setEditingCourse({...editingCourse, maxParticipants: Number(e.target.value)})} /></div>
              </div>
              <div className="space-y-2"><Label>Imagen del Curso</Label><ImageUpload value={editingCourse.image} onChange={url => setEditingCourse({...editingCourse, image: url})} folder="courses" /></div>
              
              {/* Visibility Switches */}
              <div className="border rounded-lg p-4 space-y-3">
                <Label className="text-base font-semibold">Visibilidad en la tarjeta</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2"><Switch checked={editingCourse.showDate} onCheckedChange={c => setEditingCourse({...editingCourse, showDate: c})} /><Label>Fecha</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editingCourse.showDuration} onCheckedChange={c => setEditingCourse({...editingCourse, showDuration: c})} /><Label>Duración</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editingCourse.showParticipants} onCheckedChange={c => setEditingCourse({...editingCourse, showParticipants: c})} /><Label>Participantes</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editingCourse.showObjectives} onCheckedChange={c => setEditingCourse({...editingCourse, showObjectives: c})} /><Label>Objetivos</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editingCourse.showIncludes} onCheckedChange={c => setEditingCourse({...editingCourse, showIncludes: c})} /><Label>Qué incluye</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editingCourse.showPrice} onCheckedChange={c => setEditingCourse({...editingCourse, showPrice: c})} /><Label>Precio</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editingCourse.showLocation} onCheckedChange={c => setEditingCourse({...editingCourse, showLocation: c})} /><Label>Ubicación</Label></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveCourse} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProduct?.id ? "Editar Producto" : "Nuevo Producto"}</DialogTitle><DialogDescription>Complete la información del producto</DialogDescription></DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Nombre</Label><Input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Categoría</Label><Select value={editingProduct.category} onValueChange={v => setEditingProduct({...editingProduct, category: v})}><SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger><SelectContent className="bg-card">{productCategoriesData.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Precio (MXN)</Label><Input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} /></div>
              </div>
              <div className="space-y-2"><Label>Imagen del Producto</Label><ImageUpload value={editingProduct.image} onChange={url => setEditingProduct({...editingProduct, image: url})} folder="products" /></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Switch checked={editingProduct.inStock} onCheckedChange={c => setEditingProduct({...editingProduct, inStock: c})} /><Label>En stock</Label></div>
                <div className="flex items-center gap-2"><Switch checked={editingProduct.featured} onCheckedChange={c => setEditingProduct({...editingProduct, featured: c})} /><Label>Destacado</Label></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={editingProduct.showPrice} onCheckedChange={c => setEditingProduct({...editingProduct, showPrice: c})} /><Label>Mostrar precio</Label></div>
              <div className="flex items-center gap-2"><Switch checked={editingProduct.hasSizes} onCheckedChange={c => setEditingProduct({...editingProduct, hasSizes: c})} /><Label>Vender por tallas</Label></div>
              {editingProduct.hasSizes && (
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="text-base font-semibold">Tallas</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Ej: S, M, L, XL" value={newSizeName} onChange={e => setNewSizeName(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSize())} />
                    <Button type="button" size="sm" onClick={addSize}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2">
                    {editingProduct.sizes.map((size, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-muted/50 rounded px-3 py-2">
                        <span className="font-medium">{size.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2"><Switch checked={size.inStock} onCheckedChange={() => toggleSizeStock(idx)} /><Label className="text-xs">{size.inStock ? "En stock" : "Agotado"}</Label></div>
                          <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => removeSize(idx)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProduct} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingEvent?.id ? "Editar Evento" : "Nuevo Evento"}</DialogTitle><DialogDescription>Complete la información del evento</DialogDescription></DialogHeader>
          {editingEvent && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Título</Label><Input value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Fecha</Label><Input value={editingEvent.date} placeholder="ej: 2025-03-15" onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} /></div>
                <div className="space-y-2"><Label>Ubicación</Label><Input value={editingEvent.location} onChange={e => setEditingEvent({...editingEvent, location: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>Imágenes del Evento</Label><MultiImageUpload value={editingEvent.images.filter(img => img !== "/placeholder.svg")} onChange={urls => setEditingEvent({...editingEvent, images: urls})} folder="events" maxImages={10} /></div>
              <div className="flex items-center gap-2"><Switch checked={editingEvent.featured} onCheckedChange={c => setEditingEvent({...editingEvent, featured: c})} /><Label>Evento Destacado</Label></div>
              <div className="border rounded-lg p-4 space-y-3">
                <Label className="text-base font-semibold">Visibilidad en la tarjeta</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2"><Switch checked={editingEvent.showDate ?? true} onCheckedChange={c => setEditingEvent({...editingEvent, showDate: c})} /><Label>Mostrar Fecha</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={editingEvent.showLocation ?? true} onCheckedChange={c => setEditingEvent({...editingEvent, showLocation: c})} /><Label>Mostrar Ubicación</Label></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEvent} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doctor Modal */}
      <Dialog open={isDoctorModalOpen} onOpenChange={setIsDoctorModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingDoctor?.id ? "Editar Doctor" : "Nuevo Doctor"}</DialogTitle><DialogDescription>Complete la información del doctor</DialogDescription></DialogHeader>
          {editingDoctor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nombre</Label><Input value={editingDoctor.name} onChange={e => setEditingDoctor({...editingDoctor, name: e.target.value})} /></div>
                <div className="space-y-2"><Label>Título</Label><Input value={editingDoctor.title} placeholder="ej: Dr., Lic." onChange={e => setEditingDoctor({...editingDoctor, title: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Especialidad</Label><Input value={editingDoctor.specialty} onChange={e => setEditingDoctor({...editingDoctor, specialty: e.target.value})} /></div>
                <div className="space-y-2"><Label>Experiencia</Label><Input value={editingDoctor.experience} placeholder="ej: 15 años" onChange={e => setEditingDoctor({...editingDoctor, experience: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>Resumen</Label><Textarea value={editingDoctor.summary} onChange={e => setEditingDoctor({...editingDoctor, summary: e.target.value})} /></div>
              <div className="space-y-2"><Label>Imagen del Doctor</Label><ImageUpload value={editingDoctor.image} onChange={url => setEditingDoctor({...editingDoctor, image: url})} folder="doctors" /></div>
              <div className="space-y-2"><Label>Educación (una por línea)</Label><Textarea value={editingDoctor.education.join("\n")} placeholder="Universidad...&#10;Especialidad..." onChange={e => setEditingDoctor({...editingDoctor, education: e.target.value.split("\n").filter(s => s.trim())})} /></div>
              <div className="space-y-2"><Label>Certificaciones (una por línea)</Label><Textarea value={editingDoctor.certifications.join("\n")} placeholder="Certificación...&#10;Diplomado..." onChange={e => setEditingDoctor({...editingDoctor, certifications: e.target.value.split("\n").filter(s => s.trim())})} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDoctorModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveDoctor} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingService?.id ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle><DialogDescription>Complete la información del servicio</DialogDescription></DialogHeader>
          {editingService && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Nombre</Label><Input value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Categoría</Label><Input value={editingService.category} placeholder="ej: Rehabilitación" onChange={e => setEditingService({...editingService, category: e.target.value})} /></div>
                <div className="space-y-2"><Label>Precio (MXN)</Label><Input type="number" value={editingService.price} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} /></div>
              </div>
              <div className="space-y-2"><Label>Imagen del Servicio</Label><ImageUpload value={editingService.image} onChange={url => setEditingService({...editingService, image: url})} folder="services" /></div>
              <div className="flex items-center gap-2"><Switch checked={editingService.showPrice} onCheckedChange={c => setEditingService({...editingService, showPrice: c})} /><Label>Mostrar precio</Label></div>
              <div className="flex items-center gap-2"><Switch checked={editingService.offerActive} onCheckedChange={c => setEditingService({...editingService, offerActive: c})} /><Label>Oferta del Mes Activa</Label></div>
              {editingService.offerActive && (
                <>
                  <div className="space-y-2"><Label>Descuento (%)</Label><Input type="number" min="0" max="100" value={editingService.discount} onChange={e => setEditingService({...editingService, discount: Number(e.target.value)})} /></div>
                  <div className="space-y-2"><Label>Descripción de la Oferta</Label><Textarea value={editingService.offerDescription} placeholder="ej: ¡Promoción válida hasta fin de mes!" onChange={e => setEditingService({...editingService, offerDescription: e.target.value})} /></div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveService} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Past Course Modal */}
      <Dialog open={isPastCourseModalOpen} onOpenChange={setIsPastCourseModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPastCourse?.id ? "Editar Curso Pasado" : "Nuevo Curso Pasado"}</DialogTitle><DialogDescription>Complete la información del curso pasado</DialogDescription></DialogHeader>
          {editingPastCourse && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Título</Label><Input value={editingPastCourse.title} onChange={e => setEditingPastCourse({...editingPastCourse, title: e.target.value})} /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea value={editingPastCourse.description} onChange={e => setEditingPastCourse({...editingPastCourse, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Modalidad</Label><Select value={editingPastCourse.modality} onValueChange={v => setEditingPastCourse({...editingPastCourse, modality: v as CourseModality})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent className="bg-card"><SelectItem value="presencial">Presencial</SelectItem><SelectItem value="online">Online</SelectItem><SelectItem value="hibrido">Híbrido</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Fecha</Label><Input value={editingPastCourse.date} placeholder="ej: 2025-01-15" onChange={e => setEditingPastCourse({...editingPastCourse, date: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Participantes</Label><Input type="number" value={editingPastCourse.participants} onChange={e => setEditingPastCourse({...editingPastCourse, participants: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Instructor</Label><Input value={editingPastCourse.instructor} onChange={e => setEditingPastCourse({...editingPastCourse, instructor: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>Imagen Principal</Label><ImageUpload value={editingPastCourse.image} onChange={url => setEditingPastCourse({...editingPastCourse, image: url})} folder="past-courses" /></div>
              <div className="space-y-2"><Label>Galería de Imágenes</Label><MultiImageUpload value={editingPastCourse.galleryImages || []} onChange={urls => setEditingPastCourse({...editingPastCourse, galleryImages: urls})} folder="past-courses" maxImages={10} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPastCourseModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePastCourse} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingGallery?.id ? "Editar Galería" : "Nueva Galería"}</DialogTitle><DialogDescription>{editingGallery?.id ? "Modifica los datos de la galería" : "Agrega una nueva galería de imágenes"}</DialogDescription></DialogHeader>
          {editingGallery && (
            <div className="space-y-4">
              <div><Label>Título</Label><Input value={editingGallery.title} onChange={e => setEditingGallery({...editingGallery, title: e.target.value})} /></div>
              <div><Label>Descripción</Label><Textarea value={editingGallery.description} onChange={e => setEditingGallery({...editingGallery, description: e.target.value})} /></div>
              <div><Label>Imágenes</Label><MultiImageUpload value={editingGallery.images} onChange={images => setEditingGallery({...editingGallery, images})} folder="gallery" /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGalleryModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveGallery} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingVideo?.id ? "Editar Video" : "Nuevo Video"}</DialogTitle><DialogDescription>Complete la información del video</DialogDescription></DialogHeader>
          {editingVideo && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Título</Label><Input value={editingVideo.title} onChange={e => setEditingVideo({...editingVideo, title: e.target.value})} /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea value={editingVideo.description} onChange={e => setEditingVideo({...editingVideo, description: e.target.value})} /></div>
              <div className="space-y-2"><Label>Archivo de Video</Label><VideoUpload value={editingVideo.videoUrl} onChange={url => setEditingVideo({...editingVideo, videoUrl: url})} folder="videos" /></div>
              <div className="space-y-2"><Label>Thumbnail (imagen de portada)</Label><ImageUpload value={editingVideo.thumbnail} onChange={url => setEditingVideo({...editingVideo, thumbnail: url})} folder="videos" /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVideoModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveVideo} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará permanentemente "{deleteConfirm?.name}". Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPanel;
