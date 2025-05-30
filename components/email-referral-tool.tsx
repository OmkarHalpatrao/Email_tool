"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TemplateSelector from "./template-selector"
import PlaceholderForm from "./placeholder-form"
import EmailEditor from "./email-editor"
import EmailPreview from "./email-preview"
import FileUpload from "./file-upload"
import TemplateManager from "./template-manager"
import TemplateListSelector from "./template-list-selector"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Template = {
  id: string
  name: string
  subject: string
  body: string
}

export type Placeholder = {
  key: string
  value: string
}

export default function EmailReferralTool() {
  const [activeTab, setActiveTab] = useState<string>("compose")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null)
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([
    { key: "HRname", value: "" },
    { key: "role", value: "" },
    { key: "company", value: "" },
  ])
  const [emailContent, setEmailContent] = useState<string>("")
  const [emailSubject, setEmailSubject] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [isSending, setIsSending] = useState<boolean>(false)
  const [isEditingTemplate, setIsEditingTemplate] = useState<boolean>(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState<boolean>(false)
  const [showPreview, setShowPreview] = useState<boolean>(false)

  // Add a new state for recipient email
  const [recipientEmail, setRecipientEmail] = useState<string>("")

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setEmailContent(template.body)
    setEmailSubject(template.subject)
  }

  const handlePlaceholderChange = (key: string, value: string) => {
    setPlaceholders((prev) => prev.map((p) => (p.key === key ? { ...p, value } : p)))
  }

  const fillPlaceholders = (text: string): string => {
    let filledText = text
    placeholders.forEach((p) => {
      filledText = filledText.replace(new RegExp(`{${p.key}}`, "g"), p.value || `{${p.key}}`)
    })
    return filledText
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleBackToEdit = () => {
    setShowPreview(false)
  }

  const handleCreateTemplate = () => {
    setTemplateToEdit(null)
    setIsEditingTemplate(false)
    setActiveTab("templates")
  }

  const handleEditTemplate = () => {
    setShowTemplateSelector(true)
  }

  const handleSelectTemplateToEdit = (template: Template) => {
    setTemplateToEdit(template)
    setIsEditingTemplate(true)
    setActiveTab("templates")
    setShowTemplateSelector(false)
  }

  const handleTemplateSaved = (template: Template) => {
    setActiveTab("compose")
    // If we were editing the currently selected template, update it
    if (isEditingTemplate && selectedTemplate && selectedTemplate.id === template.id) {
      setSelectedTemplate(template)
      setEmailContent(template.body)
      setEmailSubject(template.subject)
    }
  }

  // Update the handleSendEmail function to include the recipient
  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template before sending")
      return
    }

    if (!recipientEmail) {
      toast.error("Please enter a recipient email address")
      return
    }

    const missingPlaceholders = placeholders.filter((p) => !p.value && emailContent.includes(`{${p.key}}`))
    if (missingPlaceholders.length > 0) {
      toast.error(`Please fill in: ${missingPlaceholders.map((p) => p.key).join(", ")}`)
      return
    }

    try {
      setIsSending(true)
      const filledSubject = fillPlaceholders(emailSubject)
      const filledContent = fillPlaceholders(emailContent)

      const formData = new FormData()
      formData.append("subject", filledSubject)
      formData.append("content", filledContent)
      formData.append("recipient", recipientEmail)
      if (file) {
        formData.append("attachment", file)
      }

      const response = await fetch("/api/email/send", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      toast.success("Your email has been sent")

      // Reset form
      setSelectedTemplate(null)
      setEmailContent("")
      setEmailSubject("")
      setRecipientEmail("")
      setPlaceholders(placeholders.map((p) => ({ ...p, value: "" })))
      setFile(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="compose">Compose</TabsTrigger>
          </TabsList>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                Template Options <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCreateTemplate}>Create Template</DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditTemplate}>Edit Template</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="compose" className="space-y-6">
          <TemplateSelector onSelect={handleTemplateSelect} selectedTemplate={selectedTemplate} />

          {selectedTemplate && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient Email</label>
                <Input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Enter recipient email address"
                  required
                />
              </div>

              <PlaceholderForm placeholders={placeholders} onChange={handlePlaceholderChange} />

              <EmailEditor
                value={emailContent}
                onChange={setEmailContent}
                subject={emailSubject}
                onSubjectChange={setEmailSubject}
              />

              <FileUpload file={file} onChange={setFile} />

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handlePreview} className="flex-1">
                  Preview Email
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={isSending || !selectedTemplate}
                  className="flex-1"
                  variant="default"
                >
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
            </>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <TemplateManager template={templateToEdit} onSave={handleTemplateSaved} isEditing={isEditingTemplate} />
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <EmailPreview
                subject={fillPlaceholders(emailSubject)}
                content={fillPlaceholders(emailContent)}
                attachment={file}
                recipientEmail={recipientEmail}
                onBackToEdit={handleBackToEdit}
                onSend={handleSendEmail}
                isSending={isSending}
              />
            </div>
          </div>
        </div>
      )}

      {/* Template Selection Modal for Editing */}
      {showTemplateSelector && (
        <TemplateListSelector onSelect={handleSelectTemplateToEdit} onClose={() => setShowTemplateSelector(false)} />
      )}
    </div>
  )
}
