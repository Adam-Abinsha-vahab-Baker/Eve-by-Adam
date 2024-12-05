import { Activity, Droplet, LineChart, MessageSquare, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SidebarProps {
  activeForm: "blood-sugar" | "blood-pressure" | "metrics" | "sleep" | null;
  setActiveForm: (form: "blood-sugar" | "blood-pressure" | "metrics" | "sleep" | null) => void;
}

export function Sidebar({ activeForm, setActiveForm }: SidebarProps) {
  return (
      <div className="w-64 bg-card border-r border-border p-4">
        <div className="space-y-2">
          <Button
              variant={activeForm === "blood-sugar" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveForm("blood-sugar")}
          >
            <Droplet className="mr-2 h-4 w-4 text-red-500" />
            Blood Sugar
          </Button>
          <Button
              variant={activeForm === "blood-pressure" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveForm("blood-pressure")}
          >
            <Activity className="mr-2 h-4 w-4 text-blue-500" />
            Blood Pressure
          </Button>
          <Button
              variant={activeForm === "metrics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveForm("metrics")}
          >
            <LineChart className="mr-2 h-4 w-4 text-green-700" />
            Health Metrics
          </Button>
          <Button
              variant={activeForm === "sleep" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveForm("sleep")}
          >
            <Moon className="mr-2 h-4 w-4 text-purple-500" />
            Sleep
          </Button>
          <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
          >
            <Link href="/chat">
              <MessageSquare className="mr-2 h-4 w-4 text-yellow-400" />
              Chat with Me
            </Link>
          </Button>
        </div>
      </div>
  );
}
