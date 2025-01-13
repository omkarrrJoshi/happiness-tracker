import { createParayanaChapter } from "../../../backend/controller/spiritual/parayanas/parayana_chapters.js";
import { createParayanas, getParayanas } from "../../../backend/controller/spiritual/parayanas/parayanas.js";
import { spiritual } from "../../../backend/utils/constants/pillars.js";
import { parayana_chapters, parayanas } from "../../../backend/utils/constants/resources.js";
import { GET, POST } from "../../../utils/constants/rest_methods.js";

export default async function handler(req, res){
  const { pillar, resource } = req.query;
  const method = req.method;
    switch (pillar) {
      case spiritual:
        switch (resource) {
          case parayanas:
            switch (method) {
              case GET:
                return getParayanas(req, res);
              case POST:
                return createParayanas(req, res);
              default:
                // Handle unsupported methods for 'parayanas'
                break;
            }
            break;
    
          case parayana_chapters:
            switch (method) {
              case GET:
                // Add the logic for GET on 'parayana_chapters' here
                break;
              case POST:
                return createParayanaChapter(req, res);
              default:
                // Handle unsupported methods for 'parayana_chapters'
                break;
            }
            break;
    
          default:
            // Handle unsupported resources for 'spiritual'
            break;
        }
        break;
    
      default:
        // Handle unsupported pillars
        break;
    }
    
}