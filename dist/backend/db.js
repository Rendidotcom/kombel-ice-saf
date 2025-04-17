"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/db.ts
const pg_1 = require("pg");
// Pastikan DATABASE_URL didefinisikan di environment variables Vercel
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Sesuaikan dengan pengaturan SSL di Vercel
    },
});
exports.default = pool;
