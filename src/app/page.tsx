"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Send, Loader2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: number
  text: string
  isUser: boolean
}

const EnhancedAiAssistant = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    scrollAreaRef.current?.scrollTo(0, scrollAreaRef.current.scrollHeight)
  }, [scrollAreaRef]) // Updated dependency

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) {
      setError("Please enter a prompt")
      return
    }
    setLoading(true)
    setError("")

    const userMessage: Message = { id: Date.now(), text: input, isUser: true }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const apiKey = "AIzaSyAo0XS96F_F0DHgQoCtWKpY2dwbW-YQQJg"
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: `"${input}" - give proper english sentence` }] }],
        },
      )
      const aiResponse = response.data.candidates[0].content.parts[0].text
      const aiMessage: Message = { id: Date.now(), text: aiResponse, isUser: false }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("An error occurred while fetching the response. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = () => {
    setMessages([])
    setError("")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">AI Language Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </motion.div>
          )}
        </ScrollArea>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex space-x-2 w-full">
          <Input
            type="text"
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={clearConversation}
            disabled={loading || messages.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear conversation</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

export default EnhancedAiAssistant

