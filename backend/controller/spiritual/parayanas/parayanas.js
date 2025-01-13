import { createParayanaService, getParayanasService } from "../../../service/spiritual/parayanas/parayanas.js";
import { CREATE_PARAYANA } from "../../../utils/constants/api_actions.js";
import { handleServiceCallAndWriteResponse } from "../../../utils/utils.js";
import { validate } from "../../../validations/request_body.js";
import { nullValidation } from "../../../validations/request_params.js";

export async function getParayanas(req, res){
  const { user_id, date } = req.query;
  const isValid = nullValidation({user_id, date});
  if (!isValid.valid) {
    return res.status(400).json({ error: 'Invalid request params', details: isValid.message });
  }

  await handleServiceCallAndWriteResponse(
    () => getParayanasService(user_id, date),
    res,
    'Failed to fetch parayanas'
  )
}

export async function createParayanas(req, res){
  const body = req.body;
  const isValidBody = validate(CREATE_PARAYANA, body);
  if(!isValidBody.valid){
    return res.status(400).json({ error: 'Invalid request body', details: isValidBody.message });
  }

  await handleServiceCallAndWriteResponse(
    () => createParayanaService(req.body),
    res,
    'Failed to add parayana'
  )
}