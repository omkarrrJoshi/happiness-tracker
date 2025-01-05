import { GET, POST } from "../../../utils/constants/rest_methods.js";
import { createShloka, getTrackedShlokas } from "../../service/spiritual/shlokas.js";
import { CREATE_SHLOKA } from "../../utils/constants/api_actions.js";
import { validate } from "../../validations/request_body.js";
// import { nullValidation } from "../../validations/request_params.js";

export default async function handler(req, res) {
    // create shloka
    if (req.method === POST) {
        const body = req.body;
        const isValid = validate(CREATE_SHLOKA, body);
        if (!isValid.valid) {
            return res.status(400).json({ error: 'Invalid request body', details: isValid.message });
        }

        try{
            const response = await createShloka(body);
            if(response.success){
                res.status(200).json(
                    {
                        message: response.message,
                        data: response.data
                    }
                );
            }else{
                res.status(500).json({ error: 'Failed to add shloka', details: response.message });
            }
        }catch(error){
            res.status(500).json({ error: 'Failed to add shloka', details: error.message });
        }
    }

    else if (req.method === GET){
        const { user_id, date } = req.query;
        // const isValid = nullValidation({user_id, date});
        // if (!isValid.valid) {
        //     return res.status(400).json({ error: 'Invalid request params', details: isValid.message });
        // }

        try{
            const response = await getTrackedShlokas(user_id, date);
            if(response.success){
                res.status(200).json(
                    {
                        message: response.message,
                        data: response.data,
                        size: response.size,
                        date: date
                    }
                );
            }else{
                res.status(500).json({ error: 'Failed to fetch shlokas', details: response.message });
            }
        }catch(error){
            res.status(500).json({ error: 'Failed to fetch shlokas', details: error.message });
        }
    }
    else {
        res.status(405).json({ error: 'Method Not Allowed. Use GET or POST.' });
    }
}