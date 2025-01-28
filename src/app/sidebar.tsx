import type React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, MessageSquare, History } from "lucide-react"
import type { ActivePage } from "./page"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onPageChange: (page: ActivePage) => void
  activePage: ActivePage
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onPageChange, activePage }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-4">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <nav className="px-4 py-4">
            <ul className="space-y-2">
              <li>
                <Button
                  variant={activePage === "assistant" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onPageChange("assistant")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  AI Assistant
                </Button>
              </li>
              <li>
                <Button
                  variant={activePage === "history" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onPageChange("history")}
                >
                  <History className="mr-2 h-4 w-4" />
                  History
                </Button>
              </li>
            </ul>
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}

export default Sidebar

