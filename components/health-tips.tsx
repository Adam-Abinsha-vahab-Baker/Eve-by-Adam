import { Card } from "@/components/ui/card";
import { Brain, Heart, Salad, Dumbbell } from "lucide-react";

const tips = [
  {
    icon: Heart,
    title: "Heart Health",
    description: "Maintain a healthy blood pressure by reducing sodium intake and exercising regularly.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Brain,
    title: "Mental Wellness",
    description: "Practice mindfulness or meditation for 10 minutes daily to reduce stress levels.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Salad,
    title: "Nutrition",
    description: "Include a variety of colorful fruits and vegetables in your daily diet for essential nutrients.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Dumbbell,
    title: "Physical Activity",
    description: "Aim for at least 30 minutes of moderate exercise most days of the week.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
];

export function HealthTips() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Health Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${tip.bgColor}`}>
                  <Icon className={`h-6 w-6 ${tip.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}