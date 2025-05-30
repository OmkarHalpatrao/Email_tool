"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip, Loader2 } from "lucide-react"

interface EmailPreviewProps {
  subject: string
  content: string
  attachment: File | null
  recipientEmail: string
  onBackToEdit: () => void
  onSend: () => void
  isSending: boolean
}

export default function EmailPreview({
  subject,
  content,
  attachment,
  recipientEmail,
  onBackToEdit,
  onSend,
  isSending,
}: EmailPreviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Email Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">To:</h3>
            <p className="text-lg font-medium">{recipientEmail}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Subject:</h3>
            <p className="text-lg font-medium">{subject}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Body:</h3>
            <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: content }} />
          </div>

          {attachment && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-500">Attachment:</h3>
              <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 rounded-md">
                <Paperclip className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{attachment.name}</span>
                <span className="text-xs text-gray-500">({Math.round(attachment.size / 1024)} KB)</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onBackToEdit} className="flex-1">
          Edit in Editor
        </Button>
        <Button onClick={onSend} disabled={isSending} className="flex-1">
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Email"
          )}
        </Button>
      </div>
    </div>
  )
}
