import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Inisialisasi Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Uji koneksi
async function testSupabase() {
  const { data, error } = await supabase
    .from('flyers')
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Fetched data:', data);
  }
}

testSupabase();
