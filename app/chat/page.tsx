"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromptTips } from "@/components/prompt-tips";
import {TextGenerateEffect} from "@/components/ui/Text-generate-effect";
export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      console.log(data);
      // Handle the response data here
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
     <TextGenerateEffect className="text-4xl font-bold text-center text-primary mb-8" words={"Hey! How can i help?"}/>
      
      <PromptTips />
      
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything about your health..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}