import nodemailer from 'nodemailer'
import { Reservation } from './database'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT || 465),
  secure: process.env.EMAIL_SECURE !== 'false',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

function getStatusEmailContent(reservation: Reservation, status: 'confirmed' | 'rejected' | 'pending') {
  if (status === 'confirmed') {
    return {
      subject: 'Your Demo Café reservation is confirmed',
      text: `Hello ${reservation.name},\n\nYour table booking at Demo Café is confirmed for ${reservation.date} at ${reservation.time} for ${reservation.guests} guest${reservation.guests === 1 ? '' : 's'}.\n\nIf you need to update your reservation, reply to this email or contact us on WhatsApp at +91 97673 55347.\n\nThank you,\nDemo Café`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111;">
          <h1 style="color: #0f172a;">Reservation Confirmed</h1>
          <p>Hi ${reservation.name},</p>
          <p>Your table booking at <strong>Demo Café</strong> is confirmed.</p>
          <ul>
            <li><strong>Date:</strong> ${reservation.date}</li>
            <li><strong>Time:</strong> ${reservation.time}</li>
            <li><strong>Guests:</strong> ${reservation.guests}</li>
          </ul>
          <p>If you need to update your reservation, reply to this email or message us on WhatsApp at <strong>+91 97673 55347</strong>.</p>
          <p>Thank you,<br/>Demo Café</p>
        </div>
      `,
    }
  }

  if (status === 'rejected') {
    return {
      subject: 'Your Demo Café reservation request status',
      text: `Hello ${reservation.name},\n\nWe are sorry to let you know that your reservation request for ${reservation.date} at ${reservation.time} could not be confirmed. Please contact us if you would like to choose another time or date.\n\nThank you,\nDemo Café`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111;">
          <h1 style="color: #0f172a;">Reservation Request Update</h1>
          <p>Hi ${reservation.name},</p>
          <p>We are sorry to let you know that your reservation request for <strong>${reservation.date} at ${reservation.time}</strong> could not be confirmed.</p>
          <p>Please contact us if you would like to choose another time or date.</p>
          <p>Thank you,<br/>Demo Café</p>
        </div>
      `,
    }
  }

  return {
    subject: 'Your Demo Café reservation request is pending',
    text: `Hello ${reservation.name},\n\nYour reservation request for ${reservation.date} at ${reservation.time} has been received and is pending approval. We will notify you once it is confirmed or rejected.\n\nThank you,\nDemo Café`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h1 style="color: #0f172a;">Reservation Request Received</h1>
        <p>Hi ${reservation.name},</p>
        <p>Your reservation request for <strong>${reservation.date} at ${reservation.time}</strong> has been received and is pending approval.</p>
        <p>We will notify you once it is confirmed or rejected.</p>
        <p>Thank you,<br/>Demo Café</p>
      </div>
    `,
  }
}

export async function sendReservationStatusEmail(
  reservation: Reservation,
  status: 'confirmed' | 'rejected' | 'pending'
) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials are not configured. Skipping reservation email.')
    return false
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER
  const content = getStatusEmailContent(reservation, status)

  await transporter.sendMail({
    from,
    to: reservation.email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  })

  return true
}
