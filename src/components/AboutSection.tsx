import { useState } from "react";
import { ChevronLeft, ChevronRight, Award, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDoctors, Doctor } from "@/hooks/useDoctors";
import aboutMission from "@/assets/about-mission.jpg";
import aboutVision from "@/assets/about-vision.jpg";
const AboutSection = () => {
  const {
    data: doctors = [],
    isLoading
  } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const openDoctorModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };
  const scrollLeft = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  const scrollRight = () => {
    setCurrentIndex(prev => Math.min(Math.max(0, doctors.length - 3), prev + 1));
  };
  const visibleDoctors = doctors.slice(currentIndex, currentIndex + 3);
  return <section id="about" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl mb-4 font-bold uppercase tracking-wide text-destructive">
            Sobre Nosotros
          </h2>
          <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full" />
        </div>

        {/* Mission Row - Image Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-24">
          <div className="order-2 lg:order-1">
            <img src={aboutMission} alt="Nuestra Misión - HASACE Rehabilitación" className="w-full h-64 lg:h-80 object-cover rounded-none shadow-xl border-l-4 border-hasace-red" />
          </div>
          <div className="order-1 lg:order-2 bg-card p-8 border-b-2 border-hasace-red">
            <h3 className="text-2xl lg:text-3xl mb-6 text-hasace-red font-bold uppercase tracking-wide">
              Nuestra Misión
            </h3>
            <p className="text-base lg:text-lg leading-relaxed text-primary">
              Ofrecer programas de rehabilitación personalizados y de alta calidad, 
              basados en un modelo holístico que fomente la máxima independencia y 
              bienestar físico y emocional de cada paciente.
            </p>
          </div>
        </div>

        {/* Vision Row - Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-24">
          <div className="bg-card p-8 border-b-2 border-hasace-red">
            <h3 className="text-2xl lg:text-3xl mb-6 text-hasace-red font-bold uppercase tracking-wide">
              Nuestra Visión
            </h3>
            <p className="text-base lg:text-lg leading-relaxed text-primary">
              Ser el centro líder en rehabilitación integral, reconocidos por nuestra 
              innovación, resultados efectivos y el trato humano y empático hacia 
              cada familia.
            </p>
          </div>
          <div>
            <img src={aboutVision} alt="Nuestra Visión - HASACE Rehabilitación" className="w-full h-64 lg:h-80 object-cover rounded-none shadow-xl border-l-4 border-hasace-red" />
          </div>
        </div>

        {/* Doctors Carousel Section */}
        <div className="mt-20">
          <h3 className="text-2xl lg:text-3xl mb-8 text-center font-bold uppercase tracking-wide text-destructive">
            Nuestro Equipo Médico
          </h3>

          <div className="relative">
            {/* Navigation Buttons */}
            <Button variant="outline" size="icon" onClick={scrollLeft} disabled={currentIndex === 0} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background shadow-lg border-hasace-red hover:bg-hasace-red hover:text-white disabled:opacity-50">
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button variant="outline" size="icon" onClick={scrollRight} disabled={currentIndex >= doctors.length - 3} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background shadow-lg border-hasace-red hover:bg-hasace-red hover:text-white disabled:opacity-50">
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
              {visibleDoctors.map(doctor => <Card key={doctor.id} className="bg-card border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted border-2 border-hasace-red">
                      <img src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=DC2626&color=fff&size=96`} alt={doctor.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-lg mb-1 text-primary">
                      {doctor.name}
                    </h4>
                    <p className="text-sm text-hasace-red font-semibold mb-2">
                      {doctor.specialty}
                    </p>
                    <p className="text-sm mb-4 line-clamp-3 text-primary">
                      {doctor.summary}
                    </p>
                    <Button onClick={() => openDoctorModal(doctor)} className="bg-hasace-red hover:bg-hasace-red/90 font-bold">
                      Ver detalles
                    </Button>
                  </CardContent>
                </Card>)}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({
            length: Math.max(1, doctors.length - 2)
          }).map((_, i) => <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${currentIndex === i ? "bg-hasace-red" : "bg-muted-foreground/30"}`} />)}
          </div>
        </div>
      </div>

      {/* Doctor Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedDoctor && <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {selectedDoctor.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Square Image */}
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                  <img src={selectedDoctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=DC2626&color=fff&size=400`} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                </div>

                {/* Title & Specialty */}
                <div className="text-center">
                  <p className="text-lg font-semibold text-hasace-red">
                    {selectedDoctor.title}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedDoctor.specialty}
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-hasace-red" />
                    <h4 className="font-semibold">Experiencia</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedDoctor.experience}
                  </p>
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-hasace-red" />
                    <h4 className="font-semibold">Formación Académica</h4>
                  </div>
                  <ul className="space-y-1">
                    {selectedDoctor.education.map((edu, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-hasace-red">•</span>
                        {edu}
                      </li>)}
                  </ul>
                </div>

                {/* Certifications */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-hasace-red" />
                    <h4 className="font-semibold">Certificaciones</h4>
                  </div>
                  <ul className="space-y-1">
                    {selectedDoctor.certifications.map((cert, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-hasace-red">•</span>
                        {cert}
                      </li>)}
                  </ul>
                </div>
              </div>
            </>}
        </DialogContent>
      </Dialog>
    </section>;
};
export default AboutSection;