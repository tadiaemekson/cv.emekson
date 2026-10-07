/* global process */
import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const app = express()

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const CONTACT_NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL || 'tadiaemekson@gmail.com'
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null

app.use(cors())
app.use(express.json())

// Simple middleware to check admin secret
const requireAdmin = (req, res, next) => {
  const secret = req.headers['x-admin-secret']
  if (secret === ADMIN_PASSWORD) {
    next()
  } else {
    res.status(401).json({ ok: false, error: 'Unauthorized' })
  }
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body ?? {}
  if (password === ADMIN_PASSWORD) {
    res.json({ ok: true, token: ADMIN_PASSWORD })
  } else {
    res.status(401).json({ ok: false, error: 'Invalid password' })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    platform: 'vercel-serverless',
    services: {
      supabase: Boolean(supabase),
      resend: Boolean(resend),
    },
  })
})

app.get('/api/messages', requireAdmin, async (_req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        const formatted = data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          message: item.message,
          createdAt: item.created_at || item.createdAt,
        }))
        return res.json({ ok: true, messages: formatted, source: 'supabase' })
      }
      return res.status(500).json({ ok: false, error: error?.message || 'Database error' })
    }

    return res.json({ ok: true, messages: [], source: 'supabase-not-configured' })
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

    let savedToSupabase = false

    // 1. Save to Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from('messages').insert([
          {
            name: cleanMessage.name,
            email: cleanMessage.email,
            message: cleanMessage.message,
            created_at: cleanMessage.createdAt,
          },
        ])

        if (!error) {
          savedToSupabase = true
        } else {
          console.warn('Supabase insert error on Vercel:', error.message)
        }
      } catch (err) {
        console.warn('Supabase exception on Vercel:', err.message)
      }
    }

    // 2. Send email notification via Resend
    let emailSent = false
    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: `Portfolio Contact <${RESEND_FROM_EMAIL}>`,
          to: [CONTACT_NOTIFICATION_EMAIL],
          replyTo: cleanMessage.email,
          subject: `[Portfolio] Nouveau message de ${cleanMessage.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
              <h2 style="color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 8px;">Nouveau message de contact</h2>
              <p><strong>Nom :</strong> ${cleanMessage.name}</p>
              <p><strong>Email :</strong> <a href="mailto:${cleanMessage.email}">${cleanMessage.email}</a></p>
              <p><strong>Date :</strong> ${new Date().toLocaleString()}</p>
              <div style="margin-top: 16px;">
                <strong>Message :</strong>
                <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 14px; margin-top: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${cleanMessage.message}</div>
              </div>
              <hr style="margin-top: 24px; border: none; border-top: 1px solid #e4e4e7;" />
              <p style="font-size: 12px; color: #64748b; text-align: center;">Ce message a été envoyé depuis le formulaire de votre portfolio sur Vercel.</p>
            </div>
          `,
        })
        if (emailResult && !emailResult.error) {
          emailSent = true
        } else {
          console.warn('Resend email send error:', emailResult?.error)
        }
      } catch (err) {
        console.warn('Resend send exception on Vercel:', err.message)
      }
    }

    return res.status(201).json({
      ok: true,
      savedToSupabase,
      emailSent,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Failed to process message.',
      detail: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default app
