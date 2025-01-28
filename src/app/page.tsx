"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Sidebar from "./sidebar"
import AIAssistant from "./ai-assistant"
import History from "./history"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export type ActivePage = "assistant" | "history"

export interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: number
}

const ResponsiveAiAssistant: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>("assistant")
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const savedMessages = localStorage.getItem("messages")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages))
  }, [messages])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handlePageChange = (page: ActivePage) => {
    setActivePage(page)
    setSidebarOpen(false)
  }

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  const deleteMessage = (id: number) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} onPageChange={handlePageChange} activePage={activePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {activePage === "assistant" ? "AI Assistant" : "Message History"}
            </h1>
            <Button onClick={toggleSidebar} variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            {activePage === "assistant" ? (
              <AIAssistant messages={messages} addMessage={addMessage} />
            ) : (
              <History messages={messages} onDelete={deleteMessage} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ResponsiveAiAssistant

