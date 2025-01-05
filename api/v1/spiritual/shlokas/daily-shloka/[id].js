import { DELETE, PUT } from "../../../../../utils/constants/rest_methods.js";
import { updateDailyShloka } from "../../../../service/spiritual/shlokas/daily_shloka.js";
import { deleteShloka, updateShloka } from "../../../../service/spiritual/shlokas/shloka.js";
import { UPDATE_DAILY_SHLOKA } from "../../../../utils/constants/api_actions.js";
import { validate } from "../../../../validations/request_body.js";
import { nullValidation } from "../../../../validations/request_params.js";

export default async function handler(req, res) {
    // update shloka
    if (req.method === PUT) {
        const body = req.body;
        const { id, user_id, shloka_id, date } = req.query;
        const isValid = nullValidation({id, user_id, shloka_id, date});
        const isValidBody = validate(UPDATE_DAILY_SHLOKA, body);

        if (!isValid.valid || !isValidBody.valid) {
            return res.status(400).json({ error: 'Invalid request', details: isValid.message || isValidBody.message });
        }
        try{
            const response = await updateDailyShloka(id, user_id, date, shloka_id, body);
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
}