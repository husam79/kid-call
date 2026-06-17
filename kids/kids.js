import createSupabaseClient from "../utils/create-supabase-client.js";

export async function addKid(req, res, next) {
    const full_name = req.body.full_name;
    const user_id = req.body.user_id;
    const classroom = req.body.classroom;
    const is_confirmed = false;

    const client = await createSupabaseClient();

    await client.from('kids').insert({
        full_name,
        user_id,
        classroom,
        is_confirmed
    });
}

export async function getKidsOf(req, res, next) {
    
}

export async function callKid(req, res, next) {
    
}