import nodemailer from 'nodemailer'

// One SMTP login for every form; only the recipient differs (see mail.service.js).
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true', // true for port 465 (SSL), false for 587 (STARTTLS)
  requireTLS: process.env.SMTP_SECURE !== 'true', // on 587, refuse to send unencrypted (Microsoft 365 requires TLS)
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

/**
 * Checks the SMTP login at startup. Only warns: a failed check can be a passing network hiccup, every email is still
 * tried, and its real result is logged and saved in mailStatus.
 */
export async function verifyMailer() {
  try {
    await transporter.verify()
    console.log('Mail server ready')
  } catch (err) {
    console.warn('Mail server check failed (emails will still be tried on each submit):', err.message)
  }
}

export default transporter
