import { useTheme } from "@/contexts/ThemeContext";
import aboutMission from "@/assets/about-mission.jpg";
import aboutVision from "@/assets/about-vision.jpg";

const AboutSection = () => {
  const { theme } = useTheme();

  const getSectionStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-secondary";
      case "modern":
        return "bg-background";
      case "warm":
        return "bg-muted/30";
      default:
        return "bg-secondary";
    }
  };

  const getTitleStyles = () => {
    switch (theme) {
      case "corporate":
        return "text-primary font-serif";
      case "modern":
        return "text-hasace-red font-bold uppercase tracking-wide";
      case "warm":
        return "text-hasace-green font-semibold";
      default:
        return "text-primary font-serif";
    }
  };

  const getTextStyles = () => {
    switch (theme) {
      case "corporate":
        return "text-muted-foreground leading-relaxed";
      case "modern":
        return "text-foreground leading-relaxed";
      case "warm":
        return "text-muted-foreground leading-loose";
      default:
        return "text-muted-foreground leading-relaxed";
    }
  };

  const getImageStyles = () => {
    switch (theme) {
      case "corporate":
        return "rounded-lg shadow-md";
      case "modern":
        return "rounded-none shadow-xl border-l-4 border-hasace-red";
      case "warm":
        return "rounded-2xl shadow-lg";
      default:
        return "rounded-lg shadow-md";
    }
  };

  const getCardStyles = () => {
    switch (theme) {
      case "corporate":
        return "bg-card p-8 rounded-lg shadow-sm";
      case "modern":
        return "bg-card p-8 border-b-2 border-hasace-red";
      case "warm":
        return "bg-card/50 p-8 rounded-2xl";
      default:
        return "bg-card p-8 rounded-lg shadow-sm";
    }
  };

  return (
    <section id="about" className={`py-16 lg:py-24 ${getSectionStyles()}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl lg:text-4xl mb-4 ${getTitleStyles()}`}>
            Sobre Nosotros
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        {/* Mission Row - Image Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-24">
          <div className="order-2 lg:order-1">
            <img
              src={aboutMission}
              alt="Nuestra Misión - HASACE Rehabilitación"
              className={`w-full h-64 lg:h-80 object-cover ${getImageStyles()}`}
            />
          </div>
          <div className={`order-1 lg:order-2 ${getCardStyles()}`}>
            <h3 className={`text-2xl lg:text-3xl mb-6 ${getTitleStyles()}`}>
              Nuestra Misión
            </h3>
            <p className={`text-base lg:text-lg ${getTextStyles()}`}>
              Ofrecer programas de rehabilitación personalizados y de alta calidad, 
              basados en un modelo holístico que fomente la máxima independencia y 
              bienestar físico y emocional de cada paciente.
            </p>
          </div>
        </div>

        {/* Vision Row - Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className={getCardStyles()}>
            <h3 className={`text-2xl lg:text-3xl mb-6 ${getTitleStyles()}`}>
              Nuestra Visión
            </h3>
            <p className={`text-base lg:text-lg ${getTextStyles()}`}>
              Ser el centro líder en rehabilitación integral, reconocidos por nuestra 
              innovación, resultados efectivos y el trato humano y empático hacia 
              cada familia.
            </p>
          </div>
          <div>
            <img
              src={aboutVision}
              alt="Nuestra Visión - HASACE Rehabilitación"
              className={`w-full h-64 lg:h-80 object-cover ${getImageStyles()}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
