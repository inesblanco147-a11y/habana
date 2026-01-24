import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, DesignTheme } from "@/contexts/ThemeContext";

const themes: { value: DesignTheme; label: string; description: string }[] = [
  {
    value: "corporate",
    label: "Corporativo/Médico",
    description: "Profesional y confiable",
  },
  {
    value: "modern",
    label: "Moderno/Bold",
    description: "Innovador y vanguardista",
  },
  {
    value: "warm",
    label: "Cálido/Acogedor",
    description: "Humano y cercano",
  },
];

const DesignSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-card border shadow-xl rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
          <Palette className="h-4 w-4" />
          <span>Elige tu diseño</span>
        </div>
        <div className="flex flex-col gap-2">
          {themes.map((t) => (
            <Button
              key={t.value}
              variant={theme === t.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme(t.value)}
              className="justify-start text-left h-auto py-2"
            >
              <div>
                <div className="font-medium">{t.label}</div>
                <div className="text-xs opacity-70">{t.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignSelector;
