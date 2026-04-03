/* global process */

import express from 'express'
import cors from 'cors'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 5000

const dataDir = path.join(__dirname, 'data')
const messagesFile = path.join(dataDir, 'messages.json')

app.use(cors())
app.use(express.json())

async function ensureStorage() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(messagesFile)
  } catch {
    await fs.writeFile(messagesFile, '[]', 'utf8')
  }
}

async function readMessages() {
  const raw = await fs.readFile(messagesFile, 'utf8')
  return JSON.parse(raw)
}

async function writeMessages(messages) {
  await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), 'utf8')
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/messages', async (_req, res) => {
  try {
    const messages = await readMessages()
    return res.json({ ok: true, messages })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Failed to read messages.',
      detail: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body ?? {}

    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Name, email, and message are required.',
      })
    }

    const cleanMessage = {
      id: Date.now(),
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
    }

    if (!cleanMessage.name || !cleanMessage.email || !cleanMessage.message) {
      return res.status(400).json({
        ok: false,
        error: 'Name, email, and message cannot be empty.',
      })
    }

    const messages = await readMessages()
    messages.unshift(cleanMessage)
    await writeMessages(messages)

    return res.status(201).json({ ok: true })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Failed to save message.',
      detail: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

ensureStorage()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Backend startup failed:', error)
    process.exit(1)
  })

