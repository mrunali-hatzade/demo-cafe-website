import { Twilio } from 'twilio'
import { Reservation } from './database'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const smsFrom = process.env.TWILIO_PHONE_NUMBER
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM

function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/[^0-9]/g, '')
  if (!digits) return null
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 11 && digits.startsWith('0')) return `+${digits.slice(1)}`
  if (digits.length > 10) return `+${digits}`
  return null
}

function buildStatusText(reservation: Reservation, status: 'confirmed' | 'rejected' | 'pending') {
  if (status === 'confirmed') {
    return `Hello ${reservation.name}, your Demo Café reservation for ${reservation.guests} guest${reservation.guests === 1 ? '' : 's'} on ${reservation.date} at ${reservation.time} has been confirmed. Thank you!`
  }

  if (status === 'rejected') {
    return `Hello ${reservation.name}, we are sorry but your Demo Café reservation request for ${reservation.date} at ${reservation.time} could not be confirmed. Please contact us if you want to book another time.`
  }

  return `Hello ${reservation.name}, your Demo Café reservation request for ${reservation.date} at ${reservation.time} is pending. We will notify you once it is confirmed or rejected.`
}

export async function sendReservationStatusNotification(
  reservation: Reservation,
  status: 'confirmed' | 'rejected' | 'pending'
) {
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured. Skipping notification send.')
    return false
  }

  const client = new Twilio(accountSid, authToken)
  const to = normalizePhone(reservation.phone)
  if (!to) {
    console.warn('Invalid customer phone number for notification:', reservation.phone)
    return false
  }

  const body = buildStatusText(reservation, status)
  const results = [] as Array<Record<string, any>>

  if (smsFrom) {
    try {
      const message = await client.messages.create({
        body,
        from: smsFrom,
        to,
      })
      results.push({ channel: 'sms', sid: message.sid })
    } catch (error) {
      console.error('SMS send failed:', error)
    }
  }

  if (whatsappFrom) {
    try {
      const whatsappTo = to.startsWith('+') ? `whatsapp:${to.slice(1)}` : `whatsapp:${to}`
      const message = await client.messages.create({
        body,
        from: whatsappFrom,
        to: whatsappTo,
      })
      results.push({ channel: 'whatsapp', sid: message.sid })
    } catch (error) {
      console.error('WhatsApp send failed:', error)
    }
  }

  return results.length > 0
}
