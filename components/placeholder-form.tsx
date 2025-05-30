"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Placeholder } from "./email-referral-tool"

interface PlaceholderFormProps {
  placeholders: Placeholder[]
  onChange: (key: string, value: string) => void
}

export default function PlaceholderForm({ placeholders, onChange }: PlaceholderFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Fill in Placeholders</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {placeholders.map((placeholder) => (
          <div key={placeholder.key} className="space-y-2">
            <Label htmlFor={`placeholder-${placeholder.key}`}>{placeholder.key}</Label>
            <Input
              id={`placeholder-${placeholder.key}`}
              value={placeholder.value}
              onChange={(e) => onChange(placeholder.key, e.target.value)}
              placeholder={`Enter ${placeholder.key}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
