"use client"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Bold,
  Italic,
  UnderlineIcon,
  LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Template {
  id: string
  name: string
  subject: string
  body: string
}

interface TemplateManagerProps {
  template?: Template
  onSave: (template: Template) => void
}

export default function TemplateManager({ template, onSave }: TemplateManagerProps) {
  const [templateName, setTemplateName] = useState(template?.name || "")
  const [subject, setSubject] = useState(template?.subject || "")
  const [linkUrl, setLinkUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: template?.body || "<p>Enter your template content here...</p>",
  })

  useEffect(() => {
    if (template && editor) {
      editor.commands.setContent(template.body)
    }
  }, [template, editor])

  const setLink = () => {
    if (!linkUrl) return

    editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    setLinkUrl("")
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a name for your template")
      return
    }

    if (!subject.trim()) {
      toast.error("Subject required")
      return
    }

    if (!editor || !editor.getHTML() || editor.getHTML() === "<p></p>") {
      toast.error("Please enter content for your template")
      return
    }

    try {
      setIsSaving(true)

      const method = template ? "PUT" : "POST"
      const url = template ? `/api/templates/${template.id}` : "/api/templates"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: templateName,
          subject,
          body: editor.getHTML(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save template")
      }

      const savedTemplate = await response.json()

      toast.success(template ? "Template updated successfully" : "Template created successfully")

      if (!template) {
        // Reset form only for new templates
        setTemplateName("")
        setSubject("")
        editor.commands.setContent("<p>Enter your template content here...</p>")
      }

      onSave(savedTemplate)
    } catch (error) {
      toast.error("Failed to save template")
      console.error("Error saving template:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        {template ? "Edit Template" : "Create Template"}
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-subject">Subject</Label>
          <Input
            id="template-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
          />
        </div>

        <div className="space-y-2">
          <Label>Template Body</Label>
          <div className="border rounded-md overflow-hidden">
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
              {/* Toolbar buttons */}
              <Button type="button" size="icon" variant="ghost"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-gray-200" : ""}
              >
                <Bold className="h-4 w-4" />
              </Button>

              <Button type="button" size="icon" variant="ghost"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-gray-200" : ""}
              >
                <Italic className="h-4 w-4" />
              </Button>

              <Button type="button" size="icon" variant="ghost"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-gray-200" : ""}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" size="icon" variant="ghost"
                    className={editor.isActive("link") ? "bg-gray-200" : ""}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="link-url-template">URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="link-url-template"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                      <Button type="button" size="sm" onClick={setLink}>
                        Add
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* Alignment + List */}
              <Button type="button" size="icon" variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>

              <Button type="button" size="icon" variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>

              <Button type="button" size="icon" variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}
              >
                <AlignRight className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              <Button type="button" size="icon" variant="ghost"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button type="button" size="icon" variant="ghost"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            <EditorContent editor={editor} className="p-3 min-h-[200px]" />
          </div>

          <div className="text-sm text-gray-500 mt-2">
            <p>Use placeholders like {"{HRname}"}, {"{role}"}, {"{company}"} in your template.</p>
          </div>
        </div>

        <Button onClick={handleSaveTemplate} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            template ? "Update Template" : "Save Template"
          )}
        </Button>
      </div>
    </div>
  )
}
