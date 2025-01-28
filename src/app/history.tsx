import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Copy, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Message } from "./page"

interface HistoryProps {
  messages: Message[]
  onDelete: (id: number) => void
}

const History: React.FC<HistoryProps> = ({ messages, onDelete }) => {
  const [copySuccess, setCopySuccess] = useState<number | null>(null)

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(id)
        setTimeout(() => setCopySuccess(null), 2000)
      },
      (err) => {
        console.error("Failed to copy text: ", err)
      },
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Message History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 mb-2 rounded-lg ${message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              <p className="text-sm mb-2">{message.text}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{new Date(message.timestamp).toLocaleString()}</span>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(message.text, message.id)}>
                          {copySuccess === message.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(message.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default History

