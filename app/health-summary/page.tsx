"use client";

import { HealthTrends } from "@/components/health-trends";
import { HealthTips } from "@/components/health-tips";
import { BentoGrid } from "@/components/bento-grid";

export default function HealthSummaryPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Health Summary</h1>
      
      <div className="grid gap-8">
        <HealthTrends />
        <BentoGrid />
        <HealthTips />
      </div>
    </div>
  );
}