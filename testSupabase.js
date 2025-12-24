import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function testConnection() {
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
        console.error('❌ Supabase error:', error.message);
    } else {
        console.log('✅ Supabase connected! Sample data:', data);
    }
}

testConnection();