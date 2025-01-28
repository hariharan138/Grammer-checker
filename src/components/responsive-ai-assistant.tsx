"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const ResponsiveAiAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setLoading(true);
    setError("");

    const userMessage: Message = { id: Date.now(), text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const apiKey = "AIzaSyAo0XS96F_F0DHgQoCtWKpY2dwbW-YQQJg";
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: `"${input}" - give proper english sentence` }] }],
        }
      );
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      const aiMessage: Message = { id: Date.now(), text: aiResponse, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching the response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError("");
  };

  return (
    <Card className="w-full max-w-screen-sm mx-auto h-[calc(100vh-2rem)] flex flex-col sm:max-w-2xl">
  <CardHeader className="py-3 sm:py-6">
    <CardTitle className="text-lg sm:text-xl font-bold text-center">Grammar Checker</CardTitle>
  </CardHeader>
  <CardContent className="flex-grow overflow-hidden px-3 sm:px-6">
    <ScrollArea className="h-full pr-3 sm:pr-6" ref={scrollAreaRef}>
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`mb-2 sm:mb-4 ${message.isUser ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-3 rounded-lg text-sm sm:text-base ${
                message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {message.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-2"
        >
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
        </motion.div>
      )}
    </ScrollArea>
    {error && (
      <Alert variant="destructive" className="mt-3 sm:mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
  </CardContent>
  <CardFooter className="px-3 sm:px-6 py-2 sm:py-6">
    <form onSubmit={handleSubmit} className="flex items-center w-full space-x-2 sm:space-x-3">
      {/* Input Field */}
      <Input
        type="text"
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className="flex-grow text-sm sm:text-base"
        disabled={loading}
      />

      {/* Clear Button */}
      <Button
        type="button"
        variant="outline"
        onClick={clearConversation}
        disabled={loading || messages.length === 0}
        size="icon"
        className="h-10 w-10 sm:h-12 sm:w-12"
      >
        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="sr-only">Clear conversation</span>
      </Button>

      {/* Send Button */}
      <Button
        type="submit"
        disabled={loading}
        size="icon"
        className="h-10 w-10 sm:h-12 sm:w-12"
      >
        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  </CardFooter>
</Card>

  );
};

export default ResponsiveAiAssistant;
