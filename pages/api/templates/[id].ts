import type { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "@/utils/db"
import Template from "@/models/Template"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  const { id } = req.query

  // Handle GET request to fetch a specific template
  if (req.method === "GET") {
    try {
      const template = await Template.findById(id)

      if (!template) {
        return res.status(404).json({ error: "Template not found" })
      }

      return res.status(200).json(template)
    } catch (err) {
      console.error("Error fetching template:", err)
      return res.status(500).json({ error: "Failed to fetch template" })
    }
  }

  // Handle PUT request to update a template
  if (req.method === "PUT") {
    const { name, subject, body } = req.body

    if (!name || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    try {
      const updatedTemplate = await Template.findByIdAndUpdate(
        id,
        { name, subject, body },
        { new: true, runValidators: true },
      )

      if (!updatedTemplate) {
        return res.status(404).json({ error: "Template not found" })
      }

      return res.status(200).json(updatedTemplate)
    } catch (err) {
      console.error("Error updating template:", err)
      return res.status(500).json({ error: "Failed to update template" })
    }
  }

  // Handle DELETE request to delete a template
  if (req.method === "DELETE") {
    try {
      const deletedTemplate = await Template.findByIdAndDelete(id)

      if (!deletedTemplate) {
        return res.status(404).json({ error: "Template not found" })
      }

      return res.status(200).json({ success: true })
    } catch (err) {
      console.error("Error deleting template:", err)
      return res.status(500).json({ error: "Failed to delete template" })
    }
  }

  return res.status(405).json({ error: "Method not allowed" })
}
