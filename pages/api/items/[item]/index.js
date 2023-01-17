import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import {
  getItem,
  updateItem,
} from "../../../../lib/controllers/item-controller";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      const { item } = req.query;
      const token = await getToken({ req });
      const data = await getItem(item, token.sub);
      return successResponse(req, res, data);
    }
    if (req.method == "PATCH") {
      const { item } = req.query;
      const token = await getToken({ req });
      if (token && token.verified) {
        console.log(req.body);
        const updatedItem = await updateItem(token?.sub, item, req.body);
        return successResponse(req, res, updatedItem);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
