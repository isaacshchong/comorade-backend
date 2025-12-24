import express from 'express';
import supabase from '../services/supabase.js';

const router = express.Router();

// Get user by ID
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

export default router;