import { Button } from "@/components/ui/button";
import { Activity, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Eve from "./assets/Eve.png";
import BackgroundVideo from 'next-video/background-video';
import {TextGenerateEffect} from "@/components/ui/Text-generate-effect";

export default function Home() {
  return (
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-background p-4">
        {/* Background Video using next-video */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <BackgroundVideo
              src="/_next-video/Eve Background.mp4"
              autoPlay
              loop
              muted
          />
        </div>

          <div className="text-center space-y-8 max-w-4xl w-full relative z-10">
              <div className="flex justify-center">
                  {/*<Image*/}
                  {/*    src={Eve}*/}
                  {/*    alt="Eve Logo"*/}
                  {/*    width={150}*/}
                  {/*    height={150}*/}
                  {/*    className="rounded-full shadow-lg"*/}
                  {/*/>*/}
              </div>
              <TextGenerateEffect className="text-6xl font-bold  text-gray-950" words={"Health X AI"} />
              <h1 className="text-3xl font-bold  text-gray-600">Eve by Adam</h1>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="text-lg">
                      <Link href="/dashboard">
                          <Activity className="mr-2 h-5 w-5"/> Go to Dashboard
                      </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg">
                      <Link href="/team">
                          <Users className="mr-2 h-5 w-5"/> Meet Our Team
                      </Link>
                  </Button>
              </div>
          </div>
      </main>
  );
}