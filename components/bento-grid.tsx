"use client";

import { Card } from "@/components/ui/card";
import { Activity, Heart, Droplet, Moon, Sun, Utensils } from "lucide-react";

const metrics = [
  {
    title: "Average Blood Sugar",
    value: "105 mg/dL",
    icon: Droplet,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Average Blood Pressure",
    value: "120/80 mmHg",
    icon: Activity,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "Average Heart Rate",
    value: "72 BPM",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Sleep Duration",
    value: "7.5 hours",
    icon: Moon,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Daily Steps",
    value: "8,456",
    icon: Sun,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Calories",
    value: "2,100 kcal",
    icon: Utensils,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                <Icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">{metric.title}</h3>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}