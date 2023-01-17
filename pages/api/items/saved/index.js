import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import {
  getSavedItems,
  addToSavedList,
  removeItemFromSaved,
} from "../../../../lib/controllers/user-controller";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    // if (req.method == "GET") {
    //   const token = await getToken({ req });
    //   let { user, page, limit } = req.query;
    //   if (token && token?.sub) {
    //     const items = await getSavedItems(user, page, limit);
    //     return successResponse(req, res, items);
    //   }
    //   return errorResponse(req, res, "unauthorized request", 401);
    // }
    // return errorResponse(req, res, "method not allowed", 405);

    const token = await getToken({ req });
    if (token && token?.sub) {
      if (req.method == "GET") {
        let { page, limit } = req.query;
        const items = await getSavedItems(token.sub, page, limit);
        return successResponse(req, res, items);
      }
      if (req.method == "POST") {
        let { item } = req.query;
        const result = await addToSavedList(token.sub, item);
        return successResponse(req, res, result);
      }
      if (req.method == "DELETE") {
        let { item } = req.query;
        const result = await removeItemFromSaved(token.sub, item);
        return successResponse(req, res, result);
      }
    }
    return errorResponse(req, res, "unauthorized request", 401);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
