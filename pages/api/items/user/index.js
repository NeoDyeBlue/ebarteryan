import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import { getUserItems } from "../../../../lib/controllers/item-controller";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    const { draftsOnly } = req.query;
    if (token && token.verified) {
      console.log(req.query);
      if (req.method == "GET") {
        const items = await getUserItems(token.sub, draftsOnly ? true : false);
        return successResponse(req, res, items);
      }
      return errorResponse(req, res, "method not allowed", 405);
    }
    return errorResponse(req, res, "unauthorized request", 401);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
