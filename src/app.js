import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'

export const ABOUT_BRIAN = `
You are Brian Kim's portfolio website assistant.

Rules:
- Answer ONLY using info provided below.
- If you don't know, say "I don't know" and suggest checking the Resume/GitHub links.
- Be concise and helpful. No hallucinations.
- Use a neutral AI-assistant tone (clean, direct, slightly robotic, no emojis).
- Keep answers short by default (2-4 sentences) unless the user asks for more detail.
- If asked about LinkedIn or Resume/CV, give a thorough helpful answer (summary + what they can find there) and include the direct link.

Info about Brian:
- Name: Brian Kim (Kibeom Kim)
- Date of birth: January 29, 2004
- Nationality: Korean
- Languages: English, Korean (prefers English)
- Current location: Seoul, South Korea
- Identity/background: Third Culture Kid (lived across Korea, Singapore, India, and the U.S.)

Education:
- Tufts University, Electrical Engineering
- GPA around 3.59 with an upward trend
- Currently on leave for Korean military public service
- Plans to return to Tufts around Summer/Fall 2026

Technical focus:
- Embedded systems, microcontrollers, and electronics
- STM32, Arduino, ESP32
- Firmware programming in C
- Also uses Python, Node.js, and AI tools
- Prefers hardware and low-level systems over purely software roles

Experience:
- System Engineer Intern at KETI (Korea Electronics Technology Institute)
- Software Engineer Intern at Stochastic (AI startup)
- Summer Intern at SK hynix
- Member of Tufts Solar Vehicle Project
- Open to internships and collaborations

Military service:
- Public service duty in Korea (middle school assignment)
- Service period: Oct 24, 2024 to Oct 24, 2026

Interests and hobbies:
- Fitness and gym training (muscle gain, body fat reduction, chest focus, protein tracking)
- Cycling (including long solo rides)
- Skiing and sauna recovery
- Coding and building engineering projects
- Investing in U.S. tech stocks and following markets/geopolitics
- Reading financial news (e.g., Bloomberg)
- Gaming (PS4, including NBA 2K), YouTube
- Travel and international lifestyle experiences
- Sports interests include golf and baseball

Career direction:
- Interested in semiconductors/hardware engineering
- Interested in companies like Samsung and SK hynix
- Considering future paths in either Korea or the U.S.
- Has considered transferring to Northwestern after military service

Links:
- GitHub: kibeom12901
- LinkedIn: https://www.linkedin.com/in/brian-kim-2b3b40262/
- Resume PDF: https://docs.google.com/document/d/1R_ndpSbF7Pnptnhy0haO2IUpl0N-ecEF32rU8T0wcDc/export?format=pdf
`

export function healthHandler(req, res) {
  res.json({ ok: true })
}

function getResourceReply(message) {
  const q = String(message || '').toLowerCase()
  const asksLinkedIn = q.includes('linkedin')
  const asksResume = q.includes('resume') || q.includes('cv')
  const asksGitHub = q.includes('github')
  const resourceCount = [asksLinkedIn, asksResume, asksGitHub].filter(Boolean).length

  if (resourceCount === 0) return null

  if (resourceCount > 1) {
    return (
      'Use the resource cards above to open the links quickly.\n\n' +
      'LinkedIn is best for his professional profile and experience. GitHub is best for code repositories and technical work. The resume provides a concise one-page overview of education, skills, and project/internship experience.'
    )
  }

  if (asksLinkedIn) {
    return 'Click the LinkedIn card above to view his professional profile, experience, and background.'
  }

  if (asksGitHub) {
    return 'Click the GitHub card above to view his repositories, technical projects, and development activity.'
  }

  return (
    'Click the resume card above to download the latest PDF.\n\n' +
    'It gives a concise summary of education, embedded-systems focus, internship experience, and key projects.'
  )
}

export function createChatHandler(client) {
  return async function chatHandler(req, res) {
    try {
      const { message } = req.body

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Missing "message" (string) in request body.' })
      }

      const resourceReply = getResourceReply(message)
      if (resourceReply) {
        return res.json({ reply: resourceReply })
      }

      const response = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: [
          { role: 'system', content: ABOUT_BRIAN },
          { role: 'user', content: message },
        ],
      })

      return res.json({ reply: response.output_text })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: err?.message ?? 'Server error' })
    }
  }
}

export function createApp({ openaiClient } = {}) {
  const app = express()
  const frontendOrigin = process.env.FRONTEND_ORIGIN

  app.use(
    cors(
      frontendOrigin
        ? {
            origin: frontendOrigin,
          }
        : undefined
    )
  )
  app.use(express.json())

  const client =
    openaiClient ??
    new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

  app.get('/', (req, res) => {
    res.json({
      ok: true,
      message: 'Portfolio backend is running.',
      endpoints: ['/health', '/api/chat'],
    })
  })

  app.get('/health', healthHandler)
  app.post('/api/chat', createChatHandler(client))

  return app
}
