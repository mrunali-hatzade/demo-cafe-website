import { promises as fs } from 'fs'
import { randomUUID } from 'crypto'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'database.json')

export type Reservation = {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  specialRequests?: string
  status: 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt: string
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  message: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

type DatabaseData = {
  reservations: Reservation[]
  contactMessages: ContactMessage[]
}

const initialData: DatabaseData = {
  reservations: [],
  contactMessages: [],
}

async function ensureDatabaseFile(): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(initialData, null, 2), 'utf8')
  }
}

async function readDatabase(): Promise<DatabaseData> {
  await ensureDatabaseFile()
  const content = await fs.readFile(dataFile, 'utf8')
  return JSON.parse(content) as DatabaseData
}

async function writeDatabase(data: DatabaseData): Promise<void> {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8')
}

export async function getReservations(): Promise<Reservation[]> {
  const db = await readDatabase()
  return db.reservations
}

export async function addReservation(reservationData: Omit<Reservation, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Reservation> {
  const db = await readDatabase()
  const now = new Date().toISOString()
  const reservation: Reservation = {
    id: randomUUID(),
    status: 'confirmed',
    createdAt: now,
    updatedAt: now,
    ...reservationData,
  }

  db.reservations.unshift(reservation)
  await writeDatabase(db)
  return reservation
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const db = await readDatabase()
  return db.contactMessages
}

export async function addContactMessage(messageData: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>): Promise<ContactMessage> {
  const db = await readDatabase()
  const now = new Date().toISOString()
  const message: ContactMessage = {
    id: randomUUID(),
    isRead: false,
    createdAt: now,
    updatedAt: now,
    ...messageData,
  }

  db.contactMessages.unshift(message)
  await writeDatabase(db)
  return message
}
