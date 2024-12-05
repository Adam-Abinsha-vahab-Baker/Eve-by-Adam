"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast} from "@/hooks/use-toast";

const formSchema = z.object({
    glucoseLevel: z.string().min(1, "Glucose level is required"),
    measurementTime: z.string().min(1, "Measurement time is required"),
    mealStatus: z.string().min(1, "Meal status is required"),
});

export function BloodSugarForm() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            glucoseLevel: "",
            measurementTime: "",
            mealStatus: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            console.log('Submitting values:', values); // Debug log

            const response = await fetch('/api/blood-sugar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    glucoseLevel: Number(values.glucoseLevel),
                    measurementTime: new Date(values.measurementTime).toISOString(),
                    mealStatus: values.mealStatus,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to submit');
            }

            toast({
                title: "Success!",
                description: "Blood sugar measurement saved successfully.",
            });

            form.reset();
        } catch (error) {
            console.error('Form submission error:', error); // Debug log

            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save blood sugar measurement",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-6">Blood Sugar Measurement</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="glucoseLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Glucose Level (mg/dL)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter glucose level"
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
                    <FormField
                        control={form.control}
                        name="mealStatus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Meal Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select meal status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="before">Before Meal</SelectItem>
                                        <SelectItem value="after">After Meal</SelectItem>
                                        <SelectItem value="fasting">Fasting</SelectItem>
                                    </SelectContent>
                                </Select>
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