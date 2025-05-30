import type { NextApiRequest, NextApiResponse } from "next"

// Reference to the templates array from the index.ts file
// In a real app, this would be a database query
import { templates } from "@/lib/templates-store"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  // Handle DELETE request to delete a template
  if (req.method === "DELETE") {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would delete from a database
    const index = templates.findIndex((t) => t.id === id)

    if (index === -1) {
      return res.status(404).json({ error: "Template not found" })
    }

    templates.splice(index, 1)

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: "Method not allowed" })
}
