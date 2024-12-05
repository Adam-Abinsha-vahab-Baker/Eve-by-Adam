"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplet, Heart, Bed } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/Text-generate-effect";

type BloodSugarData = {
  allData: Array<{
    _id: string;
    glucoseLevel: number;
    measurementTime: string;
    mealStatus: string;
  }>;
  latestAnalysis: string;
};

type BloodPressureData = {
  allData: Array<{
    _id: string;
    systolic: number;
    diastolic: number;
    measurementTime: string;
  }>;
  latestAnalysis: string;
};

type SleepData = {
  allData: Array<{
    _id: string;
    sleepStart: string;
    sleepEnd: string;
    sleepQuality: string;
  }>;
  latestAnalysis: string;
};

function getProgressColor(value: number, type: string) {
  if (type === "bloodSugar") {
    if (value < 70) return "bg-red-500";
    if (value > 180) return "bg-red-500";
    if (value > 140) return "bg-yellow-500";
    return "bg-green-500";
  } else if (type === "bloodPressure") {
    if (value > 140) return "bg-red-500";
    if (value > 120) return "bg-yellow-500";
    return "bg-green-500";
  }
  return "bg-blue-500";
}

export function HealthMetrics() {
  const [bloodSugarData, setBloodSugarData] = useState<BloodSugarData | null>(null);
  const [bloodPressureData, setBloodPressureData] = useState<BloodPressureData | null>(null);
  const [sleepData, setSleepData] = useState<SleepData | null>(null); // State for sleep data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sugarResponse, pressureResponse, sleepResponse] = await Promise.all([
          fetch("/api/blood-sugar", { method: "GET", headers: { "Content-Type": "application/json" } }),
          fetch("/api/blood-pressure", { method: "GET", headers: { "Content-Type": "application/json" } }),
          fetch("/api/sleep", { method: "GET", headers: { "Content-Type": "application/json" } }), // Fetch sleep data
        ]);

        if (!sugarResponse.ok || !pressureResponse.ok || !sleepResponse.ok) {
          throw new Error("Failed to fetch health data");
        }

        const sugarData = await sugarResponse.json();
        const pressureData = await pressureResponse.json();
        const sleepData = await sleepResponse.json(); // Handle sleep data

        setBloodSugarData(sugarData);
        setBloodPressureData(pressureData);
        setSleepData(sleepData); // Set sleep data
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading health metrics...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!bloodSugarData || !bloodPressureData || !sleepData) return <p>No data available.</p>;

  const { allData: sugarReadings, latestAnalysis: sugarAnalysis } = bloodSugarData;
  const { allData: pressureReadings, latestAnalysis: pressureAnalysis } = bloodPressureData;
  const { allData: sleepEntries, latestAnalysis: sleepAnalysis } = sleepData;

  // Extract the latest readings
  const latestSugarReading = sugarReadings[0];
  const latestPressureReading = pressureReadings[0];
  const latestSleepEntry = sleepEntries[0]; // Get the latest sleep entry

  return (
      <div className="space-y-6">
        <TextGenerateEffect className="text-2xl font-bold text-primary" words={"Health Metrics Overview"} />

        <div className="flex space-x-6 overflow-auto">
          {/* Blood Sugar Metrics */}
          <Card className="p-6 w-96 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplet className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold">Blood Sugar</h3>
              </div>
              <span className="text-sm text-muted-foreground">
              {new Date(latestSugarReading.measurementTime).toLocaleString()}
            </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-3xl">{latestSugarReading.glucoseLevel} mg/dL</span> {/* Larger glucose value */}
                <span className="text-sm text-muted-foreground">{latestSugarReading.mealStatus}</span>
              </div>
              <Progress
                  value={(latestSugarReading.glucoseLevel / 200) * 100}
                  className={`h-2 ${getProgressColor(latestSugarReading.glucoseLevel, "bloodSugar")}`}
              />
            </div>
            {/*<TextGenerateEffect className="text-sm italic text-muted-foreground" words={sugarAnalysis} />*/}
            <h4 className="text-sm font-semibold">Past Readings:</h4>
            <ul className="list-disc pl-4 space-y-1">
              {sugarReadings.map((reading) => (
                  <li key={reading._id}>
                    {new Date(reading.measurementTime).toLocaleString()}: {reading.glucoseLevel} mg/dL ({reading.mealStatus})
                  </li>
              ))}
            </ul>
          </Card>

          {/* Blood Pressure Metrics */}
          <Card className="p-6 w-96 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Blood Pressure</h3>
              </div>
              <span className="text-sm text-muted-foreground">
              {new Date(latestPressureReading.measurementTime).toLocaleString()}
            </span>
            </div>
            <div className="space-y-4">
              {/* Systolic Reading */}
              <div>
                <span className="block text-sm font-semibold">Systolic:</span>
                <span className="text-3xl">{latestPressureReading.systolic} mmHg</span> {/* Larger systolic value */}
                <Progress
                    value={(latestPressureReading.systolic / 200) * 100}
                    className={`h-4 ${getProgressColor(latestPressureReading.systolic, "bloodPressure")}`}
                />
              </div>
              {/* Diastolic Reading */}
              <div>
                <span className="block text-sm font-semibold">Diastolic:</span>
                <span className="text-3xl">{latestPressureReading.diastolic} mmHg</span> {/* Larger diastolic value */}
                <Progress
                    value={(latestPressureReading.diastolic / 120) * 100}
                    className={`h-4 ${getProgressColor(latestPressureReading.diastolic, "bloodPressure")}`}
                />
              </div>
            </div>
            {/*<TextGenerateEffect className="text-sm italic text-muted-foreground" words={pressureAnalysis} />*/}
            <h4 className="text-sm font-semibold">Past Readings:</h4>
            <ul className="list-disc pl-4 space-y-1">
              {pressureReadings.map((reading) => (
                  <li key={reading._id}>
                    {new Date(reading.measurementTime).toLocaleString()}: {reading.systolic}/{reading.diastolic} mmHg
                  </li>
              ))}
            </ul>
          </Card>

          {/* Sleep Metrics */}
          <Card className="p-6 w-96 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bed className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Sleep Data</h3>
              </div>
              <span className="text-sm text-muted-foreground">
              {new Date(latestSleepEntry.sleepStart).toLocaleString()} - {new Date(latestSleepEntry.sleepEnd).toLocaleString()}
            </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-3xl">{latestSleepEntry.sleepQuality}</span> {/* Larger sleep quality */}
              </div>
            </div>
            {/*<TextGenerateEffect className="text-sm italic text-muted-foreground" words={sleepAnalysis} />*/}
            <h4 className="text-sm font-semibold">Past Sleep Entries:</h4>
            <ul className="list-disc pl-4 space-y-1">
              {sleepEntries.map((entry) => (
                  <li key={entry._id} className="text-lg">
                    {new Date(entry.sleepStart).toLocaleString()} - {new Date(entry.sleepEnd).toLocaleString()} ({entry.sleepQuality})
                  </li>
              ))}
            </ul>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground">
          This is just a precautionary suggestion. It may or may not be accurate.
        </p>
      </div>
  );
}
