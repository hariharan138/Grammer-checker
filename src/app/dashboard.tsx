import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Trash2 } from "lucide-react"

interface Message {
  id: number
  text: string
  isUser: boolean
}

interface DashboardProps {
  messages: Message[]
  onCopy: (text: string) => void
  onDelete: (id: number) => void
}

const Dashboard: React.FC<DashboardProps> = ({ messages, onCopy, onDelete }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Message History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 mb-2 rounded-lg ${message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              <p className="text-sm mb-2">{message.text}</p>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onCopy(message.text)}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(message.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default Dashboard

