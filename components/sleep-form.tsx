"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Clock, Bed, Timer } from "lucide-react";

const formSchema = z.object({
    sleepStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
    sleepEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
    sleepQuality: z.enum(["excellent", "good", "fair", "poor"], {
        required_error: "Sleep quality is required"
    })
});

export function SleepForm() {
    const [loading, setLoading] = useState(false);
    const [sleepDuration, setSleepDuration] = useState<string | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sleepStart: "22:00",
            sleepEnd: "06:00",
            sleepQuality: "good",
        },
    });

    const calculateSleepDuration = (start: string, end: string) => {
        // Parse start and end times
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);

        // Calculate duration
        let hoursDiff = endHour - startHour;
        let minutesDiff = endMinute - startMinute;

        // Handle overnight sleep
        if (hoursDiff < 0 || (hoursDiff === 0 && minutesDiff < 0)) {
            hoursDiff += 24;
        }

        // Adjust minutes
        if (minutesDiff < 0) {
            hoursDiff--;
            minutesDiff += 60;
        }

        // Format duration
        const hours = hoursDiff.toString().padStart(2, '0');
        const minutes = minutesDiff.toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);

            // Calculate sleep duration
            const duration = calculateSleepDuration(values.sleepStart, values.sleepEnd);
            setSleepDuration(duration);

            // Get current date
            const currentDate = new Date().toISOString().split('T')[0];

            // Create full datetime for sleep start and end
            const sleepStartTime = new Date(`${currentDate}T${values.sleepStart}:00`);
            const sleepEndTime = new Date(`${currentDate}T${values.sleepEnd}:00`);

            // Handle overnight sleep (if end time is earlier than start time)
            if (sleepEndTime < sleepStartTime) {
                sleepEndTime.setDate(sleepEndTime.getDate() + 1);
            }

            const response = await fetch("/api/sleep", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sleepStart: sleepStartTime.toISOString(),
                    sleepEnd: sleepEndTime.toISOString(),
                    sleepQuality: values.sleepQuality,
                    sleepDuration: duration
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || "Failed to submit");
            }

            toast({
                title: "Success!",
                description: `Sleep data saved. Duration: ${duration} hours`,
            });

            form.reset();
        } catch (error) {
            console.error("Form submission error:", error);

            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save sleep data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6" />
                Sleep Tracker
            </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="sleepStart"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Sleep Start Time
                                </FormLabel>
                                <FormControl>
                                    <input
                                        type="time"
                                        {...field}
                                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sleepEnd"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Wake Up Time
                                </FormLabel>
                                <FormControl>
                                    <input
                                        type="time"
                                        {...field}
                                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Sleep Quality Dropdown */}
                    <FormField
                        control={form.control}
                        name="sleepQuality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Bed className="w-4 h-4 text-primary" />
                                    Sleep Quality
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sleep quality" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="excellent">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-600">●</span> Excellent
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="good">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-400">●</span> Good
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="fair">
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-500">●</span> Fair
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="poor">
                                            <div className="flex items-center gap-2">
                                                <span className="text-red-500">●</span> Poor
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Optional: Display Sleep Duration */}
                    {sleepDuration && (
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <Timer className="w-5 h-5" />
                            Sleep Duration: {sleepDuration} hours
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full mt-4 flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Sleep Record"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}