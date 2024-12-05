"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { BloodSugarForm } from "@/components/blood-sugar-form";
import { BloodPressureForm } from "@/components/blood-pressure-form";
import { HealthMetrics } from "@/components/health-metrics";
import {TextGenerateEffect} from "@/components/ui/Text-generate-effect";
import {SleepForm} from "@/components/sleep-form";
import Link from "next/link";

export default function DashboardPage() {
  const [activeForm, setActiveForm] = useState<"blood-sugar" | "blood-pressure" | "metrics" | sleep |null>(null);

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 transition-all">
      <Sidebar activeForm={activeForm} setActiveForm={setActiveForm} />
      <main className="flex-1 p-8 overflow-auto">
        {!activeForm && (
            <div className="h-full flex flex-col items-center justify-center text-center">

                <TextGenerateEffect className="text-4xl font-bold text-primary mb-4"
                                    words={"Welcome to Your Health Dashboard"}/>

                <p className="text-muted-foreground text-lg">
                    Fill your health data in the options to your left.
                </p>
                <p className="text-muted-foreground text-lg">
                    These data will be used by Eve to learn about you.
                </p>
                <p className="text-muted-foreground text-lg">
                    Remember that Eve can only provide assistance to the data you provide.
                </p>

                <Link href="/eve">
                    <button
                        className="relative inline-flex h-16 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mt-4"
                    >
        <span
            className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
        />
                        <span
                            className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-2 text-lg font-medium text-white backdrop-blur-3xl"
                        >
            Health X AI
        </span>
                    </button>
                </Link>

            </div>
        )}
          {activeForm === "blood-sugar" && <BloodSugarForm/>}
          {activeForm === "blood-pressure" && <BloodPressureForm/>}
          {activeForm === "metrics" && <HealthMetrics/>}
          {activeForm === "sleep" && <SleepForm/>}
      </main>
    </div>
  );
}