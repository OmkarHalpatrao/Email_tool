import { connectDB } from "@/utils/db"
import Template from "@/models/Template"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  if (req.method === "GET") {
    try {
      const templates = await Template.find({})
      return res.status(200).json(templates)
    } catch (err) {
      console.error("Error fetching templates:", err)
      return res.status(500).json({ error: "Failed to fetch templates" })
    }
  }

  if (req.method === "POST") {
    const { name, subject, body } = req.body

    if (!name || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    try {
      const newTemplate = new Template({ name, subject, body })
      await newTemplate.save()
      return res.status(201).json(newTemplate)
    } catch (err) {
      console.error("Error saving template:", err)
      return res.status(500).json({ error: "Failed to create template" })
    }
  }

  return res.status(405).json({ error: "Method not allowed" })
}
