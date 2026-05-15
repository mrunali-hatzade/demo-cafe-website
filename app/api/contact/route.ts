import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { addContactMessage, getContactMessages } from '@/lib/database'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const contactMessage = await addContactMessage(validatedData)

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        id: contactMessage.id,
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

    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const messages = await getContactMessages()

    const sortedMessages = [...messages].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    )

    return NextResponse.json(sortedMessages)
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}