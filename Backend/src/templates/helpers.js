// Shared pieces of the notification emails. Inline styles and tables only, so they render the same in Gmail, Outlook
// and phone mail apps. Colours match the website (Frontend/src/index.css).

export const colors = { ink: '#0E1418', red: '#A94D42', paper: '#F7F8F6', border: '#CDD5D8', muted: '#5B6670' }

export const empty = '—'

/** User input goes into HTML, so every value is escaped. */
export const escape = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Escaped, with the user's line breaks kept. */
export const multiline = (value) => escape(value).replace(/\r?\n/g, '<br>')

/** Subjects are single-line headers, so line breaks are removed. */
export const oneLine = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim()

/** Date and time in India, e.g. "27 Oct 2026, 11:30 am". */
export const receivedAt = (date) =>
  new Date(date ?? Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })

export const link = (href, label) =>
  `<a href="${escape(href)}" style="color:${colors.red};text-decoration:none;">${escape(label)}</a>`

export const mailLink = (email) => link(`mailto:${email}`, email)
export const phoneLink = (phone) => link(`tel:${phone.replace(/[^0-9+]/g, '')}`, phone)

/** Full email: dark header, intro line, a label/value table of the fields ([label, html] pairs) and a footer. */
export function layout({ eyebrow, title, received, intro, fields, footer }) {
  const rows = fields
    .map(
      ([label, value]) => `
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid ${colors.border};width:38%;vertical-align:top;font-size:13px;color:${colors.muted};">${label}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid ${colors.border};vertical-align:top;font-size:14px;color:${colors.ink};">${value || empty}</td>
                </tr>`,
    )
    .join('')

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${colors.paper};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.paper};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid ${colors.border};">
          <tr>
            <td style="background:${colors.ink};padding:24px 28px;">
              <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${colors.red};font-weight:bold;">${eyebrow}</div>
              <div style="margin-top:8px;font-size:22px;color:#ffffff;font-weight:bold;">${title}</div>
              <div style="margin-top:6px;font-size:13px;color:${colors.border};">Received ${escape(received)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;font-size:15px;color:${colors.ink};">${intro}</td>
          </tr>
          <tr>
            <td style="padding:16px 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${colors.border};border-bottom:0;border-collapse:collapse;">${rows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid ${colors.border};font-size:12px;color:${colors.muted};">${footer}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
