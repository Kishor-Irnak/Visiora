# EvocLabz SaaS Platform

This is a full-stack JavaScript application built with:
- React/Vite frontend (TypeScript + Tailwind CSS)
- Node.js/Express backend (TypeScript)
- PostgreSQL database (with Prisma ORM) for data storage
- Shopify API integration for e-commerce data

## Project Structure

```
evoclabz/
├── client/Visiora/          # React/Vite frontend
│   ├── api/                # API service files
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── public/             # Static assets
│   ├── package.json
│   └── ...
├── server/                 # Node.js/Express backend
│   ├── routes/             # API routes
│   ├── services/           # Service implementations
│   ├── utils/              # Utility functions
│   ├── prisma/             # Prisma schema and migrations
│   ├── package.json
│   └── index.ts            # Express server
├── .env                    # Environment variables
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- MongoDB

### Backend Setup
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Generate Prisma client: `npx prisma generate`
5. Run Prisma migrations: `npx prisma db push` (or `npx prisma migrate dev`)
6. Build the project: `npm run build`
7. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the client directory: `cd client/Visiora`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Environment Variables
Create a `.env` file in the server directory with the following variables:
```env
# Database URL
POSTGRESQL_URL=postgresql://username:password@localhost:5432/evoclabz_postgres

# Server Configuration
PORT=5000

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Encryption Key (32-byte hex key for AES-256)
ENCRYPTION_KEY=your_32_byte_hex_key_here
```

## Running the Application

1. Make sure PostgreSQL is running
2. Start the backend server: `cd server && npm run dev`
3. In a new terminal, start the frontend: `cd client/Visiora && npm run dev`
4. Access the frontend at `http://localhost:3000/Visiora/`
5. Access the backend API at `http://localhost:5000`

## Project Features

- Shopify integration for e-commerce analytics
- Dashboard with order, product, and customer insights
- Secure data storage with encrypted Shopify credentials
- Responsive UI with dark theme and purple/magenta accents

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma ORM
- Shopify API Integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License.