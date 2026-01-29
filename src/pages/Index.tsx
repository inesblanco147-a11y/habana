import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import HelpSection from "@/components/HelpSection";
import AppointmentSection from "@/components/AppointmentSection";
import ProductsSection from "@/components/ProductsSection";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <CoursesSection />
        <HelpSection />
        <AppointmentSection />
        <ProductsSection />
        <EventsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
