"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Type definitions for fetched data
interface BloodPressureData {
  systolic: number;
  diastolic: number;
  measurementTime: string;
}

export function HealthTrends() {
  const [bloodPressureData, setBloodPressureData] = useState<BloodPressureData[]>([]);

  useEffect(() => {
    // Fetch the blood pressure data from your backend
    const fetchData = async () => {
      try {
        const response = await fetch("/api/blood-pressure"); // Adjust the API endpoint as needed
        const data = await response.json();

        if (response.ok) {
          setBloodPressureData(data.allData); // Assuming the response contains `allData` for blood pressure
        } else {
          console.error("Error fetching data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching blood pressure data:", error);
      }
    };

    fetchData();
  }, []);

  // Format the data for the chart
  const chartData = bloodPressureData.map((entry) => ({
    date: new Date(entry.measurementTime).toLocaleDateString("en-US", {
      weekday: "short", // Display the day of the week
    }),
    systolic: entry.systolic,
    diastolic: entry.diastolic,
  }));

  return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Blood Pressure Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444" }}
                />
                <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
  );
}
