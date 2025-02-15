export function nullValidation(queryParams){
  for(const key in queryParams){
      if(!queryParams[key]){
          return { valid: false, message: `${key} is required in query param` };
      }
  }
  return { valid: true };
}