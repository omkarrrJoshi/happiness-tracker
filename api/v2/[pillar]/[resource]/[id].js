import { updateParayanaChapterTracker } from "../../../../backend/controller/spiritual/parayanas/parayana_chapter_tracker.js";
import { spiritual } from "../../../../backend/utils/constants/pillars.js";
import { parayana_chapter_tracker } from "../../../../backend/utils/constants/resources.js";
import { PUT } from "../../../../utils/constants/rest_methods.js";

export default async function handler(req, res){
  const { pillar, resource } = req.query;
  const method = req.method;
  switch(pillar){
    case spiritual:
      switch(resource){
        case parayana_chapter_tracker:
          switch(method){
            case PUT:
              return updateParayanaChapterTracker(req, res);
          }
      }
  }
}