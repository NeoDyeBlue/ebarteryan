import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import { getItems } from "../../../../lib/controllers/item-controller";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    if (req.method == "GET") {
      const query = req.query;
      const items = await getItems(token?.sub, query.category, query);
      return successResponse(req, res, items);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
