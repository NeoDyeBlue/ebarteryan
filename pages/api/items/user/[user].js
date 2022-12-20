import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import { getUserItems } from "../../../../lib/controllers/item-controller";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      let { user, drafts, page, limit } = req.query;
      if (drafts) {
        const token = await getToken({ req });
        if (token && token.sub !== user && drafts) {
          drafts = false;
        }
      }
      const items = await getUserItems(user, drafts, page, limit);
      return successResponse(req, res, items);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
