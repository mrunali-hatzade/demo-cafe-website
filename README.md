# Demo Café Website

A modern, responsive cafe website built with Next.js, TypeScript, and Tailwind CSS. Features a complete backend with database integration, reservation system, and contact form.

## Features

### Frontend
- Modern responsive design with Tailwind CSS
- Reservation booking system
- Contact form
- Menu showcase
- Customer reviews section
- About and features sections

### Backend
- **Database**: Local JSON file storage for reservations and messages
- **API Routes**: RESTful APIs for reservations and contact messages
- **Validation**: Zod schema validation
- **Admin Dashboard**: View reservations and messages in the dashboard

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data storage**: Local JSON storage (`data/database.json`)
- **Validation**: Zod
- **UI Components**: Radix UI + shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd demo-cafe-website
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## API Endpoints

### Reservations

- **POST** `/api/reservations` - Create a new reservation
- **GET** `/api/reservations` - Get all reservations (admin)

### Contact Messages

- **POST** `/api/contact` - Send a contact message
- **GET** `/api/contact` - Get all contact messages (admin)

## Admin Dashboard

Access the admin dashboard at `/admin` to:
- View all reservations
- Manage reservation statuses
- View contact messages
- Mark messages as read/unread

## Database Schema

### Reservation
- `id`: Unique identifier
- `name`: Customer name
- `email`: Customer email
- `phone`: Customer phone
- `date`: Reservation date
- `time`: Reservation time
- `guests`: Number of guests (1-8)
- `specialRequests`: Optional special requests
- `status`: Reservation status (confirmed, cancelled, completed)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### ContactMessage
- `id`: Unique identifier
- `name`: Sender name
- `email`: Sender email
- `message`: Message content
- `isRead`: Read status
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Environment Variables

The backend uses local JSON storage and does not require a database connection string.

Create a file named `.env.local` at the project root and add your email and Twilio settings.

```env
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@example.com
EMAIL_HOST=your-smtp-host
EMAIL_PORT=465
EMAIL_SECURE=true

TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-phone-number
TWILIO_WHATSAPP_FROM=your-whatsapp-number
```

If you want a template, copy `.env.local.example` to `.env.local` and fill in the values.

This app also supports WhatsApp confirmation via the cafe business number `+91 97673 55347`.

## Development

### Database Commands

This project stores data in `data/database.json` and does not require Prisma migrations.

```bash
# Rebuild the app
npm run build

# Run the app locally
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts
│   │   └── reservations/
│   │       └── route.ts
│   ├── admin/
│   │   └── page.tsx
│   ├── reservation/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/          # shadcn/ui components
│   └── ...          # Page components
├── data/
│   └── database.json  # Local data store created automatically
├── lib/
│   ├── database.ts   # Local backend data helpers
│   └── utils.ts
└── public/
```

## License

This project is open source and available under the [MIT License](LICENSE).
