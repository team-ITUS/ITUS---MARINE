import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organisation: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    // When the enquirer ticked the Privacy Policy consent box.
    consentAt: { type: Date, required: true },
    // Whether the notification email reached the enquiries inbox; failed ones can be found and re-sent.
    // Not named "email": that is the enquirer's address above.
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

export default mongoose.model('Contact', contactSchema)
