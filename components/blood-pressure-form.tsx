"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    systolic: z.string().min(1, "Systolic pressure is required"),
    diastolic: z.string().min(1, "Diastolic pressure is required"),
    measurementTime: z.string().min(1, "Measurement time is required"),
});

export function BloodPressureForm() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            systolic: "",
            diastolic: "",
            measurementTime: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            console.log('Submitting values:', values); // Debug log

            const response = await fetch('/api/blood-pressure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    systolic: Number(values.systolic),
                    diastolic: Number(values.diastolic),
                    measurementTime: new Date(values.measurementTime).toISOString(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to submit');
            }

            toast({
                title: "Success!",
                description: "Blood pressure measurement saved successfully.",
            });

            form.reset();
        } catch (error) {
            console.error('Form submission error:', error); // Debug log

            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save blood pressure measurement",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-6">Blood Pressure Measurement</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="systolic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Systolic Pressure (mmHg)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter systolic pressure"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="diastolic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Diastolic Pressure (mmHg)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter diastolic pressure"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="measurementTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time of Measurement</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Submit"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
