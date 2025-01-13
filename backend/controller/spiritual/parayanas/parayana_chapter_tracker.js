import { updateParayanaChapterTrackerService } from "../../../service/spiritual/parayanas/parayana_chapter_tracker.js";
import { UPDATE_PARAYANA_CHAPTER_TRACKER } from "../../../utils/constants/api_actions.js";
import { handleServiceCallAndWriteResponse } from "../../../utils/utils.js";
import { validate } from "../../../validations/request_body.js";
import { nullValidation } from "../../../validations/request_params.js";

export async function updateParayanaChapterTracker(req, res){
  const { id, parayana_id, user_id } = req.query;
  const body = req.body;

  const isValidBody = validate(UPDATE_PARAYANA_CHAPTER_TRACKER, body);
  const isValidParamas = nullValidation({ id, parayana_id, user_id });

  if (!isValidBody.valid || !isValidParamas.valid) {
    return res.status(400).json({ error: 'Invalid request params', details: isValidBody.message || isValidParamas.message});
  }

  await handleServiceCallAndWriteResponse(
    () => updateParayanaChapterTrackerService(id, parayana_id, user_id, body),
    res,
    'Failed to update parayana chapter tracker'
  )
}