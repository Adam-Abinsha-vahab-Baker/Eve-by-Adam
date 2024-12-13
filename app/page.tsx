import { Button } from "@/components/ui/button";
import { Activity, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Eve from "/assets/Eve  .png";
import { TextGenerateEffect } from "@/components/ui/Text-generate-effect";

export default function Home() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-4
                   bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-800 dark:via-gray-900 dark:to-black
                   animate-gradient">
            {/* Background Video using next-video (Commented Out) */}
            {/*
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <BackgroundVideo
          src="/_next-video/Eve Background.mp4"
          autoPlay
          loop
          muted
        />
      </div>
      */}

            <div className="text-center space-y-8 max-w-4xl w-full relative z-10">
                <div className="flex justify-center">
                    {/* Uncomment this section to display the logo */}
                    {/* <Image
              src={Eve}
              alt="Eve Logo"
              width={150}
              height={150}
              className="rounded-full shadow-lg"
          /> */}
                </div>

                <TextGenerateEffect className="text-6xl font-bold text-gray-950 dark:text-gray-50" words="Health X AI" />
                <h1 className="text-3xl font-bold text-gray-600 dark:text-gray-300">Eve by Adam</h1>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg" className="text-lg">
                        <Link href="/dashboard">
                            <Activity className="mr-2 h-5 w-5" /> Go to Dashboard
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="text-lg">
                        <Link href="/team">
                            <Users className="mr-2 h-5 w-5" /> Meet Our Team
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}

/* Add animation to the gradient background */
