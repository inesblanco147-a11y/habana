import PageLayout from "@/components/PageLayout";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import HelpSection from "@/components/HelpSection";
import AppointmentSection from "@/components/AppointmentSection";
import ProductsSection from "@/components/ProductsSection";
import ProductosPage from "@pages/ProductosPage";
import ServicesSection from "@/components/ServicesSection";
import EventsSection from "@/components/EventsSection";
import JsonLd from "@/components/JsonLd";

const Index = () => {
  return (
    <PageLayout showBreadcrumbs={false}>
      <JsonLd />
      <Hero />
      <AboutSection />
      <CoursesSection />
      <ProductsSection />
      <ServicesSection />
      <EventsSection />
      <AppointmentSection />
      <HelpSection />
    </PageLayout>
  );
};

export default Index;
