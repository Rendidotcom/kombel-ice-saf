// backend/db.ts
import { Pool } from 'pg';

// Pastikan DATABASE_URL didefinisikan di environment variables Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Sesuaikan dengan pengaturan SSL di Vercel
  },
});

export default pool;
