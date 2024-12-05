"use client";

import { Card } from "@/components/ui/card";
import { Brain, Heart, Activity, Apple } from "lucide-react";
import { motion } from "framer-motion";

const tips = [
  {
    icon: Heart,
    title: "Health Analysis",
    prompt: "Analyze my blood pressure trends",
    color: "text-red-500",
    glowColor: "group-hover:shadow-red-500/50",
  },
  {
    icon: Brain,
    title: "Wellness Advice",
    prompt: "Tips for better sleep quality",
    color: "text-purple-500",
    glowColor: "group-hover:shadow-purple-500/50",
  },
  {
    icon: Activity,
    title: "Fitness Goals",
    prompt: "Recommend exercises for beginners",
    color: "text-blue-500",
    glowColor: "group-hover:shadow-blue-500/50",
  },
  {
    icon: Apple,
    title: "Nutrition Guide",
    prompt: "Suggest a balanced meal plan",
    color: "text-green-500",
    glowColor: "group-hover:shadow-green-500/50",
  },
];

export function PromptTips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tips.map((tip, index) => {
        const Icon = tip.icon;
        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className={`p-6 cursor-pointer group transition-all duration-300 hover:shadow-lg ${tip.glowColor}`}>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-background ${tip.color}`}>
                  <Icon className={`h-6 w-6 ${tip.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Try: "{tip.prompt}"
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}