import AppError from "../utils/app-error.js";
import createSupabaseClient from "../utils/create-supabase-client.js";

export async function addKid(req, res, next) {
    const full_name = req.body.full_name;
    const user_id = req.body.user_id ?? req.user.id;
    const classroom = req.body.classroom;
    const is_confirmed = req.user.role === 'admin';

    const client = await createSupabaseClient();

    const {error} = await client.from('kids').insert({
        full_name,
        user_id,
        classroom,
        is_confirmed
    });

    if(error){
        throw new AppError("Could not add kid", 500, error);
    }

    return res.sendStatus(200);
}

export async function getKidsOf(req, res, next) {
    const client = await createSupabaseClient();
    const user_id = req.params.id;

    const { data, error } = await client.from("kids").select("*").eq("user_id", user_id);

    if(error){
        throw new AppError("Could not getting kids", 500, error);
    }

    res.send(data);
}

export async function getAllKids(req, res, next) {
    if(req.user.role !== 'admin') {
        throw new AppError("You are not allowed to access this resource", 403, error);
    }

    const client = await createSupabaseClient();

    const { data, error } = await client.from("kids").select("*");

    if(error){
        throw new AppError("Could not getting all kids", 500, error);
    }

    res.send(data);
}

export async function callKid(req, res, next) {
    const user_id = req.body.user_id ?? req.user.id;
    const kid_id = req.params.id;

    const client = await createSupabaseClient();

    // First we need to check if the kid exists
    const { data: kidData, error: kidError } = await client.from("kids").select("*").eq("id", kid_id).single();

    if(kidError){
        throw new AppError("Could not find the kid", 404, kidError);
    }
    // And he has to be confirmed too
    if(!kidData.is_confirmed){
        throw new AppError("The kid is not confirmed", 400, error);
    }
    // Then add the call to the public.calls & public.call_logs
    const {error: errorCall} = await client.from('calls').insert({
        user_id,
        kid_id
    });

    const {error: errorLogs} = await client.from('call_logs').insert({
        user_id,
        kid_id
    });

     if(errorCall){
        throw new AppError("Could not call the kid", 500, error);
    }

    if(errorLogs){
        throw new AppError("Could not log the call", 500, errorLogs);
    }

    return res.sendStatus(200);

}