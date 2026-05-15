import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { addReservation, getReservations } from '@/lib/database'
import { sendReservationStatusEmail } from '@/lib/mail'
import { sendReservationStatusNotification } from '@/lib/notifications'

const reservationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  guests: z.number().min(1).max(8, 'Maximum 8 guests allowed'),
  specialRequests: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = reservationSchema.parse(body)

    const reservation = await addReservation(validatedData)

    try {
      await sendReservationStatusEmail(reservation, 'confirmed')
    } catch (emailError) {
      console.error('Failed to send reservation confirmation email:', emailError)
    }

    try {
      await sendReservationStatusNotification(reservation, 'confirmed')
    } catch (notificationError) {
      console.error('Failed to send reservation confirmation notification:', notificationError)
    }

    return NextResponse.json(
      {
        message: 'Reservation created successfully',
        reservation: {
          id: reservation.id,
          name: reservation.name,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Reservation creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const reservations = await getReservations()

    const sortedReservations = [...reservations].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    )

    return NextResponse.json(sortedReservations)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}