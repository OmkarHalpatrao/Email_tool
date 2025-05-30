"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, X } from "lucide-react"
import type { Template } from "./email-referral-tool"

interface TemplateListSelectorProps {
  onSelect: (template: Template) => void
  onClose: () => void
}

export default function TemplateListSelector({ onSelect, onClose }: TemplateListSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/templates")
        if (!response.ok) {
          throw new Error("Failed to fetch templates")
        }
        const data = await response.json()
        setTemplates(data)
      } catch (error) {
        console.error("Error fetching templates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Select Template to Edit</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              {searchQuery ? "No templates match your search" : "No templates found"}
            </p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelect(template)}
                >
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{template.subject}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
