import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, typingTests, userSettings } from '@shared/schema';

// Create connection
const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);
export const db = drizzle(client);

// For Supabase migration in the future, you would use:
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = process.env.SUPABASE_URL || '';
// const supabaseKey = process.env.SUPABASE_KEY || '';
// export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database by ensuring tables exist
export async function initDb() {
  try {
    console.log('Connecting to database...');
    
    // Test the connection by querying for a user
    await db.select().from(users).limit(1);
    console.log('Database connection successful');
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}