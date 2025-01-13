import { createParayanaChapterService } from "../../../service/spiritual/parayanas/parayana_chapters.js";
import { CREATE_PARAYANA_CHAPTER } from "../../../utils/constants/api_actions.js";
import { handleServiceCallAndWriteResponse } from "../../../utils/utils.js";
import { validate } from "../../../validations/request_body.js";

export async function createParayanaChapter(req, res){
  const body = req.body;
  const isValidBody = validate(CREATE_PARAYANA_CHAPTER, body);
  if(!isValidBody.valid){
    return res.status(400).json({ error: 'Invalid request body', details: isValidBody.message });
  }

  await handleServiceCallAndWriteResponse(
    () => createParayanaChapterService(body),
    res,
    'Failed to add parayana'
  )
}