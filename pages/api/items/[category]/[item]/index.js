import {
  successResponse,
  errorResponse,
} from "../../../../../utils/response-utils";
import { getItem } from "../../../../../lib/controllers/item-controller";

export default async function handler(req, res) {
  try {
    const { category, item } = req.query;
    if (req.method == "GET") {
      const data = await getItem(category, item);
      return successResponse(req, res, data);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
