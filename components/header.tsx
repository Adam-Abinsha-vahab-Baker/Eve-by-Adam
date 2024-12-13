"use client";

import { Activity, BarChart2, User } from 'lucide-react';
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import Evelogo from "@/app/assets/Eve  .png"
import Evelogodark from "@/app/assets/Eve - Light.png"
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { theme } = useTheme();
  return (
      <header className="border-b border-border relative">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
              href="/"
              className="absolute left-4 flex items-center space-x-2 text-primary"
          >
            <Image
                src={theme === "dark" ? Evelogo : Evelogodark} // Choose logo based on theme
                alt={"evelogo"}
                width={60}
                height={60}
            />
          </Link>

          {/* Centered Button with Conic Gradient Border */}
          <div className="flex-1 flex justify-center">

          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <Button variant="ghost" asChild>
              <Link href="/health-summary" className="flex items-center space-x-2">
                <BarChart2 className="h-5 w-5" />
                <span>Health Summary</span>
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
  );
}
