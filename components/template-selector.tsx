"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Template } from "./email-referral-tool"

interface TemplateSelectorProps {
  onSelect: (template: Template) => void
  selectedTemplate: Template | null
}

export default function TemplateSelector({ onSelect, selectedTemplate }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch("/api/templates")
        if (!response.ok) {
          throw new Error("Failed to fetch templates")
        }
        const data = await response.json()
        setTemplates(data)
      } catch (error) {
        console.error("Failed to load templates:", error)
        // Fallback to demo templates if API fails
        setTemplates([
          {
            id: "1",
            name: "Job Referral Template",
            subject: "Referral for {role} position at {company}",
            body: "<p>Dear {HRname},</p><p>I hope this email finds you well. I would like to refer a highly qualified candidate for the {role} position at {company}.</p><p>They have an impressive background and I believe they would be a great addition to your team.</p><p>I have attached their resume for your review.</p><p>Best regards,</p><p>Your Name</p>",
          },
          {
            id: "2",
            name: "Follow-up Template",
            subject: "Following up on {role} referral",
            body: "<p>Dear {HRname},</p><p>I am writing to follow up on the referral I sent last week for the {role} position at {company}.</p><p>I wanted to check if you had a chance to review their application and if there's any additional information I can provide.</p><p>Thank you for your time.</p><p>Best regards,</p><p>Your Name</p>",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Email Template</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {selectedTemplate ? selectedTemplate.name : loading ? "Loading templates..." : "Select a template..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search templates..." />
            <CommandList>
              <CommandEmpty>No template found.</CommandEmpty>
              <CommandGroup>
                {templates.map((template) => (
                  <CommandItem
                    key={template.id}
                    value={template.id}
                    onSelect={() => {
                      onSelect(template)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedTemplate?.id === template.id ? "opacity-100" : "opacity-0")}
                    />
                    {template.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
