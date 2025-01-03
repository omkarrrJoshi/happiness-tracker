import { DELETE, PUT } from "../../../../../utils/constants/rest_methods.js";
import { deleteShloka, updateShloka } from "../../../../service/spiritual/shlokas/shloka.js";
import { nullValidation } from "../../../../validations/request_params.js";

export default async function handler(req, res) {
    // update shloka
    if (req.method === PUT) {
        const body = req.body;
        const { id, user_id, shloka_id, date } = req.query;
        const isValid = nullValidation({id, user_id, shloka_id, date});
        if (!isValid.valid) {
            return res.status(400).json({ error: 'Invalid request params', details: isValid.message });
        }
        try{
            const response = await updateShloka(id, user_id, date, shloka_id, body);
            if(response.success){
                res.status(200).json(
                    {
                        id: response.id,
                        message: response.message,
                        data: response.updatedData
                    }
                );
            }else{
                res.status(500).json({ error: 'Failed to update shlokas', details: response.message });
            }
        }catch(error){
            res.status(500).json({ error: 'Failed to update shlokas', details: error.message });
        }

    }

    else if(req.method === DELETE){
        //id is of daily tracked sholka, not shloka
        const { id, user_id, shloka_id, date } = req.query;
        const isValid = nullValidation({id, user_id, shloka_id, date});
        if (!isValid.valid) {
            return res.status(400).json({ error: 'Invalid request params', details: isValid.message });
        }
        try{
            const response = await deleteShloka(id, user_id, date, shloka_id);
            if(response.success){
                res.status(200).json(
                    {
                        id: response.id,
                        message: response.message,
                    }
                );
            }else{
                res.status(500).json({ error: 'Failed to delete shlokas', details: response.message });
            }
        }catch(error){
            res.status(500).json({ error: 'Failed to delete shlokas', details: error.message });
        }
    }
}