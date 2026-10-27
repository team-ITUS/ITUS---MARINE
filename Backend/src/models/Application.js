import mongoose from 'mongoose'

// Must match Frontend/src/data/careers.ts exactly ("1–3 years" uses an en dash).
export const experienceOptions = [
  'Less than 1 year',
  '1–3 years',
  '3–5 years',
  '5–10 years',
  '10–15 years',
  '15+ years',
]

export const expertiseOptions = [
  'Marine Engineering',
  'Naval Architecture',
  'Production & Fabrication',
  'Mechanical & Propulsion',
  'Electrical & Systems Integration',
  'Testing & Commissioning',
  'Service & Maintenance',
  'Project Management',
  'Sales & Business Development',
  'Operations',
  'Other',
]

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    currentRole: { type: String, trim: true },
    experience: { type: String, required: true, enum: experienceOptions },
    expertise: { type: String, required: true, enum: expertiseOptions },
    linkedin: { type: String, trim: true },
    message: { type: String, trim: true, maxlength: 2000 },
    cv: {
      originalName: String,
      fileName: String,
      path: String,
      size: Number,
      mimeType: String,
    },
    // Whether the notification email reached the careers inbox; failed ones can be found and re-sent.
    // Not named "email": that is the applicant's address above.
    mailStatus: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      accepted: [String], // recipients the SMTP server took
      rejected: [String], // recipients it refused
      response: String, // the SMTP server's reply, e.g. "250 OK id=..."
      error: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Application', applicationSchema)
