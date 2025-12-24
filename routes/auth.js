import express from 'express';
import supabase from '../services/supabase.js';

const router = express.Router();

// Example route using supabase
router.get('/test', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

export default router;