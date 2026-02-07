import { useState } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  GraduationCap, 
  ShoppingBag,
  ArrowLeft,
  Calendar,
  Users,
  Loader2,
  LogOut,
  Settings,
  Sparkles,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Course, PastCourse, CourseModality, CourseAvailability } from "@/types/course";
import { Product } from "@/types/product";
import { Event } from "@/types/event";
import { Doctor } from "@/types/doctor";
import { Service } from "@/types/service";
import { GalleryItem } from "@/types/gallery";
import { useCourses, usePastCourses } from "@/hooks/useCourses";
import { useProducts } from "@/hooks/useProducts";
import { useEvents } from "@/hooks/useEvents";
import { useDoctors } from "@/hooks/useDoctors";
import { useServices } from "@/hooks/useServices";
import { useGallery } from "@/hooks/useGallery";
import { useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/useCourseMutations";
import { useCreatePastCourse, useUpdatePastCourse, useDeletePastCourse } from "@/hooks/usePastCourseMutations";
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProductMutations";
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/useEventMutations";
import { useCreateDoctor, useUpdateDoctor, useDeleteDoctor } from "@/hooks/useDoctorMutations";
import { useCreateService, useUpdateService, useDeleteService } from "@/hooks/useServiceMutations";
import { useCreateGallery, useUpdateGallery, useDeleteGallery } from "@/hooks/useGalleryMutations";
import { useExternalDoctors } from "@/hooks/useExternalDoctors";
import { useCreateExternalDoctor, useUpdateExternalDoctor, useDeleteExternalDoctor } from "@/hooks/useExternalDoctorMutations";
import { ExternalDoctor } from "@/types/externalDoctor";
import { Globe, Image } from "lucide-react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteSettings";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";

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
  const { data: externalDoctorsData, isLoading: loadingExternalDoctors } = useExternalDoctors();
  const externalDoctorsList = externalDoctorsData?.pages.flatMap(page => page.results) ?? [];

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
  const createExtDoctor = useCreateExternalDoctor();
  const updateExtDoctor = useUpdateExternalDoctor();
  const deleteExtDoctor = useDeleteExternalDoctor();
  const createGallery = useCreateGallery();
  const updateGallery = useUpdateGallery();
  const deleteGallery = useDeleteGallery();
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
  const [editingExtDoctor, setEditingExtDoctor] = useState<ExternalDoctor | null>(null);
  const [isExtDoctorModalOpen, setIsExtDoctorModalOpen] = useState(false);
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);

  // Past course state
  const [editingPastCourse, setEditingPastCourse] = useState<PastCourse | null>(null);
  const [isPastCourseModalOpen, setIsPastCourseModalOpen] = useState(false);

  // Gallery state
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // Settings state
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cerrar sesión. Intenta de nuevo.",
        });
        setIsLoggingOut(false);
      }
      // If successful, the auth state change will redirect the user
    } catch (err) {
      console.error("Logout error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al cerrar sesión.",
      });
      setIsLoggingOut(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN"
    }).format(price);
  };

  // Initialize settings when loaded
  const getSettingValue = (key: string) => {
    if (editingSettings[key] !== undefined) return editingSettings[key];
    return settingsData.find(s => s.key === key)?.value || "";
  };

  const handleSettingChange = (key: string, value: string) => {
    setEditingSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      for (const [key, value] of Object.entries(editingSettings)) {
        await updateSetting.mutateAsync({ key, value });
      }
      setEditingSettings({});
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado correctamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la configuración. Intenta de nuevo.",
      });
    }
  };

  // Course handlers
  const handleAddCourse = () => {
    setEditingCourse({
      id: "",
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
    const closeModal = () => { setIsCourseModalOpen(false); setEditingCourse(null); };
    if (editingCourse.id) {
      updateCourse.mutate(editingCourse, { onSuccess: closeModal, onError: () => {} });
    } else {
      const { id, ...courseData } = editingCourse;
      createCourse.mutate(courseData, { onSuccess: closeModal, onError: () => {} });
    }
  };

  const handleDeleteCourse = (id: string, title: string) => {
    setDeleteConfirm({ type: "course", id, name: title });
  };

  // Product handlers
  const handleAddProduct = () => {
    setEditingProduct({
      id: "",
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
    const closeModal = () => { setIsProductModalOpen(false); setEditingProduct(null); };
    if (editingProduct.id) {
      updateProduct.mutate(editingProduct, { onSuccess: closeModal, onError: () => {} });
    } else {
      const { id, ...productData } = editingProduct;
      createProduct.mutate(productData, { onSuccess: closeModal, onError: () => {} });
    }
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setDeleteConfirm({ type: "product", id, name });
  };

  // Event handlers
  const handleAddEvent = () => {
    setEditingEvent({
      id: "",
      title: "",
      description: "",
      date: "",
      location: "",
      images: [],
      featured: false
    });
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent({ ...event });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!editingEvent) return;
    const closeModal = () => { setIsEventModalOpen(false); setEditingEvent(null); };
    if (editingEvent.id) {
      updateEvent.mutate(editingEvent, { onSuccess: closeModal, onError: () => {} });
    } else {
      const { id, ...eventData } = editingEvent;
      createEvent.mutate(eventData, { onSuccess: closeModal, onError: () => {} });
    }
  };

  const handleDeleteEvent = (id: string, title: string) => {
    setDeleteConfirm({ type: "event", id, name: title });
  };

  // Doctor handlers
  const handleAddDoctor = () => {
    setEditingDoctor({
      id: "",
      name: "",
      title: "",
      specialty: "",
      summary: "",
      experience: "",
      education: [],
      certifications: [],
      image: ""
    });
    setIsDoctorModalOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor({ ...doctor });
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = () => {
    if (!editingDoctor) return;

    const closeModal = () => {
      setIsDoctorModalOpen(false);
      setEditingDoctor(null);
    };

    if (editingDoctor.id) {
      updateDoctor.mutate(editingDoctor, {
        onSuccess: closeModal,
        onError: () => {
          // Error is handled in the hook, just ensure modal can be closed
        }
      });
    } else {
      const { id, ...doctorData } = editingDoctor;
      createDoctor.mutate(doctorData, {
        onSuccess: closeModal,
        onError: () => {
          // Error is handled in the hook, just ensure modal can be closed
        }
      });
    }
  };

  // Service handlers
  const handleAddService = () => {
    setEditingService({
      id: "",
      name: "",
      description: "",
      image: "",
      price: 0,
      discount: 0,
      offerActive: false,
      offerDescription: "",
      category: ""
    });
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = () => {
    if (!editingService) return;
    const closeModal = () => { setIsServiceModalOpen(false); setEditingService(null); };
    if (editingService.id) {
      updateService.mutate(editingService, { onSuccess: closeModal, onError: () => {} });
    } else {
      const { id, ...serviceData } = editingService;
      createService.mutate(serviceData, { onSuccess: closeModal, onError: () => {} });
    }
  };

  const handleDeleteService = (id: string, name: string) => {
    setDeleteConfirm({ type: "service", id, name });
  };

  const handleDeleteDoctor = (id: string, name: string) => {
    setDeleteConfirm({ type: "doctor", id, name });
  };

  // External Doctor handlers
  const handleAddExtDoctor = () => {
    setEditingExtDoctor({
      id: 0,
      name: "",
      nombre: "",
      title: "",
      specialty: "",
      especialidad: "",
      especialidad2: "",
      summary: "",
      experience: "",
      education: [],
      certifications: [],
      formacionAcademica: "",
      description: "",
      image: null,
      imagen: null
    });
    setIsExtDoctorModalOpen(true);
  };

  const handleEditExtDoctor = (doctor: ExternalDoctor) => {
    setEditingExtDoctor({ ...doctor });
    setIsExtDoctorModalOpen(true);
  };

  const handleSaveExtDoctor = () => {
    if (!editingExtDoctor) return;
    const closeModal = () => {
      setIsExtDoctorModalOpen(false);
      setEditingExtDoctor(null);
    };
    if (editingExtDoctor.id) {
      updateExtDoctor.mutate(editingExtDoctor, { onSuccess: closeModal });
    } else {
      const { id, ...data } = editingExtDoctor;
      createExtDoctor.mutate(data, { onSuccess: closeModal });
    }
  };

  const handleDeleteExtDoctor = (id: number, name: string) => {
    setDeleteConfirm({ type: "ext_doctor", id: String(id), name });
  };

  // Past Course handlers
  const handleAddPastCourse = () => {
    setEditingPastCourse({
      id: "",
      title: "",
      description: "",
      image: "",
      modality: "presencial",
      date: "",
      participants: 0,
      rating: 5,
      testimonial: "",
      testimonialAuthor: "",
      instructor: "",
      galleryImages: [],
    });
    setIsPastCourseModalOpen(true);
  };

  const handleEditPastCourse = (course: PastCourse) => {
    setEditingPastCourse({ ...course });
    setIsPastCourseModalOpen(true);
  };

  const handleSavePastCourse = () => {
    if (!editingPastCourse) return;
    const closeModal = () => { setIsPastCourseModalOpen(false); setEditingPastCourse(null); };
    if (editingPastCourse.id) {
      updatePastCourse.mutate(editingPastCourse, { onSuccess: closeModal, onError: () => {} });
    } else {
      const { id, ...data } = editingPastCourse;
      createPastCourse.mutate(data, { onSuccess: closeModal, onError: () => {} });
    }
  };

  const handleDeletePastCourse = (id: string, title: string) => {
    setDeleteConfirm({ type: "past_course", id, name: title });
  };

  // Gallery handlers
  const handleAddGallery = () => {
    setEditingGallery({ id: "", title: "", description: "", images: [] });
    setIsGalleryModalOpen(true);
  };

  const handleEditGallery = (item: GalleryItem) => {
    setEditingGallery({ ...item });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGallery = () => {
    if (!editingGallery) return;
    const closeModal = () => { setIsGalleryModalOpen(false); setEditingGallery(null); };
    if (editingGallery.id) {
      updateGallery.mutate(editingGallery, { onSuccess: closeModal, onError: () => {} });
    } else {
      const { id, ...data } = editingGallery;
      createGallery.mutate(data, { onSuccess: closeModal, onError: () => {} });
    }
  };

  const handleDeleteGallery = (id: string, title: string) => {
    setDeleteConfirm({ type: "gallery", id, name: title });
  };


  const confirmDelete = () => {
    if (!deleteConfirm) return;

    switch (deleteConfirm.type) {
      case "course":
        deleteCourse.mutate(deleteConfirm.id);
        break;
      case "product":
        deleteProduct.mutate(deleteConfirm.id);
        break;
      case "event":
        deleteEvent.mutate(deleteConfirm.id);
        break;
      case "doctor":
        deleteDoctor.mutate(deleteConfirm.id);
        break;
      case "ext_doctor":
        deleteExtDoctor.mutate(Number(deleteConfirm.id));
        break;
      case "service":
        deleteService.mutate(deleteConfirm.id);
        break;
      case "past_course":
        deletePastCourse.mutate(deleteConfirm.id);
        break;
      case "gallery":
        deleteGallery.mutate(deleteConfirm.id);
        break;
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
      case "ext_doctors": return handleAddExtDoctor;
      case "services": return handleAddService;
      case "gallery": return handleAddGallery;
      default: return handleAddCourse;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "courses": return "Curso";
      case "past_courses": return "Curso Pasado";
      case "products": return "Producto";
      case "events": return "Evento";
      case "doctors": return "Doctor";
      case "ext_doctors": return "Doctor Ext.";
      case "services": return "Servicio";
      case "gallery": return "Galería";
      default: return "Item";
    }
  };

  const isSaving = createCourse.isPending || updateCourse.isPending || 
                   createProduct.isPending || updateProduct.isPending ||
                   createEvent.isPending || updateEvent.isPending ||
                   createDoctor.isPending || updateDoctor.isPending ||
                   createService.isPending || updateService.isPending ||
                   createPastCourse.isPending || updatePastCourse.isPending;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al sitio
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cerrando...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona los contenidos de HASACE</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cursos</p>
                  <p className="text-2xl font-bold">{coursesData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Productos</p>
                  <p className="text-2xl font-bold">{productsData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Eventos</p>
                  <p className="text-2xl font-bold">{eventsData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Doctores</p>
                  <p className="text-2xl font-bold">{doctorsData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-hasace-red/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-hasace-red" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Servicios</p>
                  <p className="text-2xl font-bold">{servicesData.length}</p>
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
                <TabsList className="flex-wrap h-auto">
                  <TabsTrigger value="courses" className="gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="hidden sm:inline">Cursos</span>
                  </TabsTrigger>
                  <TabsTrigger value="past_courses" className="gap-2">
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">Cursos Pasados</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="hidden sm:inline">Productos</span>
                  </TabsTrigger>
                  <TabsTrigger value="events" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Eventos</span>
                  </TabsTrigger>
                  <TabsTrigger value="doctors" className="gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Doctores</span>
                  </TabsTrigger>
                  <TabsTrigger value="ext_doctors" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">Doctores Ext.</span>
                  </TabsTrigger>
                  <TabsTrigger value="services" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Servicios</span>
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="gap-2">
                    <Image className="h-4 w-4" />
                    <span className="hidden sm:inline">Galería</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Configuración</span>
                  </TabsTrigger>
                </TabsList>
                
                {activeTab !== "settings" && (
                  <Button onClick={getAddHandler()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar {getTabLabel()}
                  </Button>
                )}
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Courses Tab */}
              <TabsContent value="courses">
                {loadingCourses ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
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
                                  onClick={() => handleDeleteCourse(course.id, course.title)}
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
                )}
              </TabsContent>

              {/* Past Courses Tab */}
              <TabsContent value="past_courses">
                {loadingPastCourses ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Modalidad</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Participantes</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastCoursesData.map(course => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium max-w-[200px] truncate">
                              {course.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{course.modality}</Badge>
                            </TableCell>
                            <TableCell>{course.date}</TableCell>
                            <TableCell>{course.participants}</TableCell>
                            <TableCell>{course.rating}/5</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleEditPastCourse(course)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeletePastCourse(course.id, course.title)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products">
                {loadingProducts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
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
                              {product.featured && <Badge variant="secondary" className="bg-accent text-accent-foreground">Sí</Badge>}
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
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
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
                )}
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events">
                {loadingEvents ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Ubicación</TableHead>
                          <TableHead>Imágenes</TableHead>
                          <TableHead>Destacado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventsData.map(event => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium max-w-[200px] truncate">
                              {event.title}
                            </TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{event.images.length} imgs</Badge>
                            </TableCell>
                            <TableCell>
                              {event.featured && <Badge variant="secondary" className="bg-accent text-accent-foreground">Sí</Badge>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleEditEvent(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteEvent(event.id, event.title)}
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
                )}
              </TabsContent>

              {/* Doctors Tab */}
              <TabsContent value="doctors">
                {loadingDoctors ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Especialidad</TableHead>
                          <TableHead>Experiencia</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {doctorsData.map(doctor => (
                          <TableRow key={doctor.id}>
                            <TableCell className="font-medium max-w-[200px] truncate">
                              {doctor.name}
                            </TableCell>
                            <TableCell>{doctor.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{doctor.specialty}</Badge>
                            </TableCell>
                            <TableCell>{doctor.experience}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleEditDoctor(doctor)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteDoctor(doctor.id, doctor.name)}
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
                )}
              </TabsContent>

              {/* External Doctors Tab */}
              <TabsContent value="ext_doctors">
                {loadingExternalDoctors ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Especialidad</TableHead>
                          <TableHead>Experiencia</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {externalDoctorsList.map(doctor => (
                          <TableRow key={doctor.id}>
                            <TableCell className="font-medium max-w-[200px] truncate">
                              {doctor.name}
                            </TableCell>
                            <TableCell>{doctor.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{doctor.specialty}</Badge>
                            </TableCell>
                            <TableCell>{doctor.experience}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleEditExtDoctor(doctor)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteExtDoctor(doctor.id, doctor.name)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services">
                {loadingServices ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Descuento</TableHead>
                          <TableHead>Oferta Activa</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {servicesData.map(service => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium max-w-[200px] truncate">
                              {service.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{service.category}</Badge>
                            </TableCell>
                            <TableCell>{formatPrice(service.price)}</TableCell>
                            <TableCell>
                              {service.discount > 0 && (
                                <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                                  -{service.discount}%
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {service.offerActive && (
                                <Badge className="bg-hasace-red text-white">Sí</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleEditService(service)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteService(service.id, service.name)}
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
                )}
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery">
                {loadingGallery ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Imágenes</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {galleryData.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{item.description}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.images.length} fotos</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleEditGallery(item)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteGallery(item.id, item.title)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                {loadingSettings ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Información de Contacto</CardTitle>
                        <CardDescription>
                          Configura los datos de contacto que aparecen en el sitio
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contact_phone">Teléfono de contacto</Label>
                            <Input
                              id="contact_phone"
                              value={getSettingValue("contact_phone")}
                              placeholder="+52 442 123 4567"
                              onChange={e => handleSettingChange("contact_phone", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact_email">Email de contacto</Label>
                            <Input
                              id="contact_email"
                              type="email"
                              value={getSettingValue("contact_email")}
                              placeholder="contacto@hasace.mx"
                              onChange={e => handleSettingChange("contact_email", e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Integraciones</CardTitle>
                        <CardDescription>
                          Configura WhatsApp y Google Calendar para los botones del sitio
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="whatsapp_number">Número de WhatsApp</Label>
                          <Input
                            id="whatsapp_number"
                            value={getSettingValue("whatsapp_number")}
                            placeholder="521234567890 (código de país + número sin espacios)"
                            onChange={e => handleSettingChange("whatsapp_number", e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Ingresa el número con código de país, sin espacios ni caracteres especiales. Ejemplo: 521234567890
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="google_calendar_url">URL de Google Calendar</Label>
                          <Input
                            id="google_calendar_url"
                            value={getSettingValue("google_calendar_url")}
                            placeholder="https://calendar.google.com/calendar/..."
                            onChange={e => handleSettingChange("google_calendar_url", e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Pega aquí el enlace público de tu calendario de Google para que los usuarios puedan agendar citas
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveSettings}
                        disabled={Object.keys(editingSettings).length === 0 || updateSetting.isPending}
                      >
                        {updateSetting.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Configuración
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
          <DialogHeader>
            <DialogTitle>
              {editingCourse?.id ? "Editar Curso" : "Nuevo Curso"}
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
                    onValueChange={value => setEditingCourse({...editingCourse, modality: value as CourseModality})}
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
                    onValueChange={value => setEditingCourse({...editingCourse, availability: value as CourseAvailability})}
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
                    value={editingCourse.date}
                    placeholder="ej: 15 de Marzo, 2025"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={editingCourse.instructor}
                    onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Máx. Participantes</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={editingCourse.maxParticipants}
                    onChange={e => setEditingCourse({...editingCourse, maxParticipants: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagen del Curso</Label>
                <ImageUpload
                  value={editingCourse.image}
                  onChange={url => setEditingCourse({...editingCourse, image: url})}
                  folder="courses"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCourse} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct?.id ? "Editar Producto" : "Nuevo Producto"}
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

              <div className="space-y-2">
                <Label>Imagen del Producto</Label>
                <ImageUpload
                  value={editingProduct.image}
                  onChange={url => setEditingProduct({...editingProduct, image: url})}
                  folder="products"
                />
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
            <Button onClick={handleSaveProduct} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent?.id ? "Editar Evento" : "Nuevo Evento"}
            </DialogTitle>
            <DialogDescription>
              Complete la información del evento
            </DialogDescription>
          </DialogHeader>
          
          {editingEvent && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="eventTitle">Título</Label>
                <Input
                  id="eventTitle"
                  value={editingEvent.title}
                  onChange={e => setEditingEvent({...editingEvent, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDescription">Descripción</Label>
                <Textarea
                  id="eventDescription"
                  value={editingEvent.description}
                  onChange={e => setEditingEvent({...editingEvent, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Fecha</Label>
                  <Input
                    id="eventDate"
                    value={editingEvent.date}
                    placeholder="ej: 2025-03-15"
                    onChange={e => setEditingEvent({...editingEvent, date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventLocation">Ubicación</Label>
                  <Input
                    id="eventLocation"
                    value={editingEvent.location}
                    onChange={e => setEditingEvent({...editingEvent, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imágenes del Evento</Label>
                <MultiImageUpload
                  value={editingEvent.images.filter(img => img !== "/placeholder.svg")}
                  onChange={urls => setEditingEvent({...editingEvent, images: urls})}
                  folder="events"
                  maxImages={10}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingEvent.featured}
                  onCheckedChange={checked => setEditingEvent({...editingEvent, featured: checked})}
                />
                <Label>Evento Destacado</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEvent} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doctor Modal */}
      <Dialog open={isDoctorModalOpen} onOpenChange={setIsDoctorModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDoctor?.id ? "Editar Doctor" : "Nuevo Doctor"}
            </DialogTitle>
            <DialogDescription>
              Complete la información del doctor
            </DialogDescription>
          </DialogHeader>
          
          {editingDoctor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Nombre</Label>
                  <Input
                    id="doctorName"
                    value={editingDoctor.name}
                    onChange={e => setEditingDoctor({...editingDoctor, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorTitle">Título</Label>
                  <Input
                    id="doctorTitle"
                    value={editingDoctor.title}
                    placeholder="ej: Dr., Lic., Mtro."
                    onChange={e => setEditingDoctor({...editingDoctor, title: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Input
                    id="specialty"
                    value={editingDoctor.specialty}
                    onChange={e => setEditingDoctor({...editingDoctor, specialty: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experiencia</Label>
                  <Input
                    id="experience"
                    value={editingDoctor.experience}
                    placeholder="ej: 15 años"
                    onChange={e => setEditingDoctor({...editingDoctor, experience: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Resumen</Label>
                <Textarea
                  id="summary"
                  value={editingDoctor.summary}
                  onChange={e => setEditingDoctor({...editingDoctor, summary: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Imagen del Doctor</Label>
                <ImageUpload
                  value={editingDoctor.image}
                  onChange={url => setEditingDoctor({...editingDoctor, image: url})}
                  folder="doctors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Educación (una por línea)</Label>
                <Textarea
                  id="education"
                  value={editingDoctor.education.join("\n")}
                  placeholder="Universidad Nacional Autónoma de México&#10;Especialidad en Fisioterapia"
                  onChange={e => setEditingDoctor({...editingDoctor, education: e.target.value.split("\n").filter(s => s.trim())})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certificaciones (una por línea)</Label>
                <Textarea
                  id="certifications"
                  value={editingDoctor.certifications.join("\n")}
                  placeholder="Certificación en Terapia Manual&#10;Diplomado en Rehabilitación Deportiva"
                  onChange={e => setEditingDoctor({...editingDoctor, certifications: e.target.value.split("\n").filter(s => s.trim())})}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDoctorModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveDoctor} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* External Doctor Modal */}
      <Dialog open={isExtDoctorModalOpen} onOpenChange={setIsExtDoctorModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExtDoctor?.id ? "Editar Doctor Externo" : "Nuevo Doctor Externo"}
            </DialogTitle>
            <DialogDescription>
              Complete la información del doctor (backend externo)
            </DialogDescription>
          </DialogHeader>
          {editingExtDoctor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={editingExtDoctor.name} onChange={e => setEditingExtDoctor({...editingExtDoctor, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={editingExtDoctor.title} placeholder="ej: Dr., Lic." onChange={e => setEditingExtDoctor({...editingExtDoctor, title: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Especialidad</Label>
                  <Input value={editingExtDoctor.specialty} onChange={e => setEditingExtDoctor({...editingExtDoctor, specialty: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Experiencia</Label>
                  <Input value={editingExtDoctor.experience} placeholder="ej: 15 años" onChange={e => setEditingExtDoctor({...editingExtDoctor, experience: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Resumen</Label>
                <Textarea value={editingExtDoctor.summary} onChange={e => setEditingExtDoctor({...editingExtDoctor, summary: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Educación (una por línea)</Label>
                <Textarea
                  value={Array.isArray(editingExtDoctor.education) ? editingExtDoctor.education.join("\n") : ""}
                  placeholder="Universidad...&#10;Especialidad..."
                  onChange={e => setEditingExtDoctor({...editingExtDoctor, education: e.target.value.split("\n").filter(s => s.trim())})}
                />
              </div>
              <div className="space-y-2">
                <Label>Certificaciones (una por línea)</Label>
                <Textarea
                  value={Array.isArray(editingExtDoctor.certifications) ? editingExtDoctor.certifications.join("\n") : ""}
                  placeholder="Certificación...&#10;Diplomado..."
                  onChange={e => setEditingExtDoctor({...editingExtDoctor, certifications: e.target.value.split("\n").filter(s => s.trim())})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExtDoctorModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveExtDoctor} disabled={createExtDoctor.isPending || updateExtDoctor.isPending}>
              {(createExtDoctor.isPending || updateExtDoctor.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente "{deleteConfirm?.name}". Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Service Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService?.id ? "Editar Servicio" : "Nuevo Servicio"}
            </DialogTitle>
            <DialogDescription>
              Complete la información del servicio
            </DialogDescription>
          </DialogHeader>
          
          {editingService && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Nombre</Label>
                <Input
                  id="serviceName"
                  value={editingService.name}
                  onChange={e => setEditingService({...editingService, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceDescription">Descripción</Label>
                <Textarea
                  id="serviceDescription"
                  value={editingService.description}
                  onChange={e => setEditingService({...editingService, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceCategory">Categoría</Label>
                  <Input
                    id="serviceCategory"
                    value={editingService.category}
                    placeholder="ej: Rehabilitación"
                    onChange={e => setEditingService({...editingService, category: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="servicePrice">Precio (MXN)</Label>
                  <Input
                    id="servicePrice"
                    type="number"
                    value={editingService.price}
                    onChange={e => setEditingService({...editingService, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagen del Servicio</Label>
                <ImageUpload
                  value={editingService.image}
                  onChange={url => setEditingService({...editingService, image: url})}
                  folder="services"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingService.offerActive}
                  onCheckedChange={checked => setEditingService({...editingService, offerActive: checked})}
                />
                <Label>Oferta del Mes Activa</Label>
              </div>

              {editingService.offerActive && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="serviceDiscount">Descuento (%)</Label>
                    <Input
                      id="serviceDiscount"
                      type="number"
                      min="0"
                      max="100"
                      value={editingService.discount}
                      onChange={e => setEditingService({...editingService, discount: Number(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offerDescription">Descripción de la Oferta</Label>
                    <Textarea
                      id="offerDescription"
                      value={editingService.offerDescription}
                      placeholder="ej: ¡Promoción válida hasta fin de mes!"
                      onChange={e => setEditingService({...editingService, offerDescription: e.target.value})}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveService} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Past Course Modal */}
      <Dialog open={isPastCourseModalOpen} onOpenChange={setIsPastCourseModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPastCourse?.id ? "Editar Curso Pasado" : "Nuevo Curso Pasado"}
            </DialogTitle>
            <DialogDescription>Complete la información del curso pasado</DialogDescription>
          </DialogHeader>
          
          {editingPastCourse && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={editingPastCourse.title} onChange={e => setEditingPastCourse({...editingPastCourse, title: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea value={editingPastCourse.description} onChange={e => setEditingPastCourse({...editingPastCourse, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Modalidad</Label>
                  <Select value={editingPastCourse.modality} onValueChange={value => setEditingPastCourse({...editingPastCourse, modality: value as CourseModality})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input value={editingPastCourse.date} placeholder="ej: 2025-01-15" onChange={e => setEditingPastCourse({...editingPastCourse, date: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Participantes</Label>
                  <Input type="number" value={editingPastCourse.participants} onChange={e => setEditingPastCourse({...editingPastCourse, participants: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Rating (1-5)</Label>
                  <Input type="number" min="1" max="5" step="0.1" value={editingPastCourse.rating} onChange={e => setEditingPastCourse({...editingPastCourse, rating: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Instructor</Label>
                  <Input value={editingPastCourse.instructor} onChange={e => setEditingPastCourse({...editingPastCourse, instructor: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Testimonio</Label>
                <Textarea value={editingPastCourse.testimonial} onChange={e => setEditingPastCourse({...editingPastCourse, testimonial: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>Autor del Testimonio</Label>
                <Input value={editingPastCourse.testimonialAuthor} onChange={e => setEditingPastCourse({...editingPastCourse, testimonialAuthor: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>Imagen Principal</Label>
                <ImageUpload value={editingPastCourse.image} onChange={url => setEditingPastCourse({...editingPastCourse, image: url})} folder="past-courses" />
              </div>

              <div className="space-y-2">
                <Label>Galería de Imágenes</Label>
                <MultiImageUpload value={editingPastCourse.galleryImages || []} onChange={urls => setEditingPastCourse({...editingPastCourse, galleryImages: urls})} folder="past-courses" maxImages={10} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPastCourseModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePastCourse} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGallery?.id ? "Editar Galería" : "Nueva Galería"}</DialogTitle>
            <DialogDescription>
              {editingGallery?.id ? "Modifica los datos de la galería" : "Agrega una nueva galería de imágenes"}
            </DialogDescription>
          </DialogHeader>
          {editingGallery && (
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input value={editingGallery.title} onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })} />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea value={editingGallery.description} onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })} />
              </div>
              <div>
                <Label>Imágenes</Label>
                <MultiImageUpload
                  value={editingGallery.images}
                  onChange={(images) => setEditingGallery({ ...editingGallery, images })}
                  folder="gallery"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGalleryModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveGallery} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminPanel;
