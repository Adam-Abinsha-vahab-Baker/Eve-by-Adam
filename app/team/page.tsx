import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Brain, Heart, Lightbulb, Rocket, PencilRuler } from 'lucide-react';
import Link from "next/link";

const teamMembers = [
    {
        name: "Adam Abinsha Vahab Baker",
        role: "Creator and Founder",
        description: "'I don't think I can do this!' - After I did it.",
        icon: Rocket,
    },
    {
        name: "Sreehari Anil",
        role: "Vision",
        description: "Shaping the future of healthcare through innovative AI solutions",
        icon: Lightbulb,
    },
    {
        name: "Hannah Baker",
        role: "Creative Director",
        description: "Infusing empathy and compassion into our AI-driven healthcare approach",
        icon: Heart,
    },
    {
        name: "Alansha Vahab Baker",
        role: "Project Manager",
        description: "Orchestrating our team's efforts to bring Eve to life",
        icon: Brain,
    },
    {
        name: "Edita Garbulyte",
    },
    {
        name: "Ashik Noushad",
    },
    {
        name: "Alia Ansari",
    },
    {
        name: "Willy Orland Bezerra",
    },
];

export default function TeamPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-primary/10 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <Button asChild variant="ghost" className="mb-8">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>
                <h1 className="text-4xl font-bold text-center mb-12 text-primary">Meet the Minds Behind Eve</h1>

                {/* Adam's Section */}
                <div className="mb-12">
                    <Card className="bg-card hover:shadow-lg transition-shadow">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-primary/10 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-4">
                                <Rocket className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold">Adam Abinsha Vahab Baker</CardTitle>
                            <CardDescription className="text-xl font-medium text-muted-foreground">Creator and Founder</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground">'I don't think I can do this!' - After I did it.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sreehari, Hannah, Alansha */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {teamMembers.slice(1, 4).map((member) => (
                        <Card key={member.name} className="bg-card hover:shadow-lg transition-shadow">
                            <CardHeader className="text-center">
                                <div className="mx-auto bg-primary/10 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                                    <member.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-semibold">{member.name}</CardTitle>
                                <CardDescription className="text-lg font-medium text-muted-foreground">{member.role}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-muted-foreground">{member.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* List of Remaining Members */}
                <div>
                    <h2 className="text-2xl font-bold text-center mb-4 text-primary">Other Team Members</h2>
                    <ul className="text-center space-y-2">
                        {teamMembers.slice(4).map((member) => (
                            <li key={member.name} className="text-lg font-medium text-muted-foreground">{member.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}
