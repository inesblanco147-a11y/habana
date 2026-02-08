import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Image, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCourses, usePastCourses } from "@/hooks/useCourses";
import { Course, CourseModality } from "@/types/course";
import courseDefaultImage from "@/assets/course-default.jpg";

const CoursesSection = () => {
  const { data: upcomingCourses = [] } = useCourses();
  const { data: pastCourses = [] } = usePastCourses();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [modalityFilter, setModalityFilter] = useState<CourseModality | "todos">("todos");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getModalityBadge = (modality: CourseModality) => {
    const colors = {
      presencial: "bg-hasace-green text-white",
      online: "bg-blue-500 text-white",
      híbrido: "bg-purple-500 text-white",
    };
    const labels = { presencial: "Presencial", online: "Online", híbrido: "Híbrido" };
    return <Badge className={`${colors[modality]} hover:opacity-90`}>{labels[modality]}</Badge>;
  };

  const getAvailabilityBadge = (availability: Course["availability"]) => {
    const styles = {
      disponible: "bg-green-100 text-green-800 border-green-200",
      "ultimos-lugares": "bg-amber-100 text-amber-800 border-amber-200",
      agotado: "bg-red-100 text-red-800 border-red-200",
    };
    const labels = { disponible: "Cupo disponible", "ultimos-lugares": "Últimos lugares", agotado: "Agotado" };
    return (
      <Badge variant="outline" className={styles[availability]}>
        {labels[availability]}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  const filteredCourses = upcomingCourses.filter(
    (course) => modalityFilter === "todos" || course.modality === modalityFilter,
  );

  const openCourseModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };
  const handleWhatsApp = (course: Course) => {
    const message = encodeURIComponent(`Hola, me interesa inscribirme al curso: ${course.title}`);
    window.open(`https://wa.me/524427981962?text=${message}`, "_blank");
  };

  return (
    <section id="courses" className="py-16 lg:py-24 bg-muted/20">
      <div
        className="text-white py-12 lg:py-16 mb-12"
        style={{
          background: "linear-gradient(90deg, hsl(221, 64%, 33%) 0%, hsl(221, 64%, 55%) 50%, hsl(221, 64%, 33%) 100%)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-4">Cursos y Capacitaciones</h2>
          <div className="w-24 h-1 bg-white/60 mx-auto rounded-full mb-4" />
          <p className="text-lg lg:text-xl opacity-90 max-w-2xl mx-auto">
            Actualiza tus conocimientos con nuestros cursos especializados en rehabilitación y medicina deportiva
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <TabsList className="bg-muted">
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-hasace-red data-[state=active]:text-white"
              >
                Próximos Cursos
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-hasace-red data-[state=active]:text-white">
                Cursos Pasados
              </TabsTrigger>
            </TabsList>
            {activeTab === "upcoming" && (
              <div className="flex gap-2 flex-wrap">
                {(["todos", "presencial", "online", "hibrido"] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={modalityFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setModalityFilter(filter)}
                    className={modalityFilter === filter ? "bg-hasace-red hover:bg-hasace-red/90" : ""}
                  >
                    {filter === "todos" ? "Todos" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Courses */}
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={course.image || courseDefaultImage}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">{getModalityBadge(course.modality)}</div>
                      <div className="absolute top-3 right-3">{getAvailabilityBadge(course.availability)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-primary">{course.title}</h3>
                    <p className="text-sm mb-4 line-clamp-2 text-secondary-foreground">{course.description}</p>
                    <div className="space-y-2 text-sm">
                      {course.showDate && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(course.date)}</span>
                        </div>
                      )}
                      {course.showDuration && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                      {course.showLocation && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{course.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    {course.showPrice && (
                      <span className="text-xl font-bold text-hasace-red">{formatPrice(course.price)}</span>
                    )}
                    <Button
                      onClick={() => openCourseModal(course)}
                      disabled={course.availability === "agotado"}
                      className="bg-hasace-red hover:bg-hasace-red/90 font-bold ml-auto"
                    >
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Past Courses */}
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastCourses.map((course) => (
                <Card
                  key={course.id}
                  className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={course.image || courseDefaultImage}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg grayscale-[30%]"
                      />
                      <div className="absolute top-3 left-3">{getModalityBadge(course.modality)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-foreground">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{course.participants} participantes</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Instructor: {course.instructor}</span>
                    {course.galleryImages && course.galleryImages.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-hasace-red text-hasace-red hover:bg-hasace-red hover:text-white"
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Ver galería
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Course Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex gap-2 mb-2">
                  {getModalityBadge(selectedCourse.modality)}
                  {getAvailabilityBadge(selectedCourse.availability)}
                </div>
                <DialogTitle className="text-xl">{selectedCourse.title}</DialogTitle>
                <DialogDescription>{selectedCourse.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <img
                  src={selectedCourse.image || courseDefaultImage}
                  alt={selectedCourse.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedCourse.showDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-hasace-red" />
                      <span>{formatDate(selectedCourse.date)}</span>
                    </div>
                  )}
                  {selectedCourse.showDuration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-hasace-red" />
                      <span>{selectedCourse.duration}</span>
                    </div>
                  )}
                  {selectedCourse.showLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-hasace-red" />
                      <span>{selectedCourse.location}</span>
                    </div>
                  )}
                  {selectedCourse.showParticipants && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-hasace-red" />
                      <span>
                        {selectedCourse.currentParticipants}/{selectedCourse.maxParticipants} participantes
                      </span>
                    </div>
                  )}
                </div>
                {selectedCourse.showObjectives && selectedCourse.objectives.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Objetivos del Curso</h4>
                    <ul className="space-y-1">
                      {selectedCourse.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-hasace-green mt-0.5 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedCourse.showIncludes && selectedCourse.includes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">¿Qué incluye?</h4>
                    <ul className="space-y-1">
                      {selectedCourse.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-hasace-red mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  {selectedCourse.showPrice && (
                    <div>
                      <p className="text-sm text-muted-foreground">Precio</p>
                      <p className="text-2xl font-bold text-hasace-red">{formatPrice(selectedCourse.price)}</p>
                    </div>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="outline"
                      onClick={() => handleWhatsApp(selectedCourse)}
                      className="gap-2 border-hasace-red text-hasace-red hover:bg-hasace-red hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CoursesSection;
