"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { motion, AnimatePresence } from "framer-motion";

interface AnswerResult {
  answer: string;
  sources?: string[];
}

export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<AnswerResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setAnswer(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: prompt }),
      });

      const data = await response.json();

      setAnswer({
        answer: data.answer,
        sources: data.sources,
      });
    } catch (error) {
      console.error("Error:", error);

      setAnswer({
        answer: "Sorry, something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          Hey! How can I help?
        </h1>

        <AnimatePresence>
          {answer && (
              <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -20}}
                  className="mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border dark:border-gray-700"
              >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={materialDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                        );
                      },
                      h1: ({node, ...props}) => (
                          <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
                      ),
                      h2: ({node, ...props}) => (
                          <h2 className="text-xl font-semibold mt-3 mb-2" {...props} />
                      ),
                      p: ({node, ...props}) => (
                          <p className="mb-4 leading-relaxed" {...props} />
                      ),
                      ul: ({node, ...props}) => (
                          <ul className="list-disc pl-5 mb-4" {...props} />
                      ),
                      ol: ({node, ...props}) => (
                          <ol className="list-decimal pl-5 mb-4" {...props} />
                      ),
                      a: ({node, ...props}) => (
                          <a
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                          />
                      ),
                    }}
                    className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
                >
                  {answer.answer}
                </ReactMarkdown>

                {answer.sources && answer.sources.length > 0 && (
                    <div className="mt-4 border-t dark:border-gray-700 pt-2">
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Sources:
                      </h4>
                      <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                        {answer.sources.map((source, index) => (
                            <motion.li
                                key={index}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.4 + index * 0.1}}
                                className="truncate"
                            >
                              • {source}
                            </motion.li>
                        ))}
                      </ul>
                    </div>
                )}
              </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex gap-2">
            <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me anything about your health..."
                className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
            />
            <Button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 transition duration-200 disabled:bg-blue-300"
            >
              {isLoading ? (
                  <span className="animate-pulse">Loading...</span>
              ) : (
                  <SendHorizontal className="h-5 w-5"/>
              )}
            </Button>
          </div>
        </form>

      </div>
  );
}