import * as dotenv from "dotenv";

dotenv.config({ path: './.env.local' }); // Explicitly specify .env.local

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY);
console.log("MONGODB_URI:", process.env.MONGODB_URI);