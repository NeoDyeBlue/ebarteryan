import { successResponse, errorResponse } from "../../../utils/response-utils";
import { getAllCategories } from "../../../lib/data-access/category";

export default async function handler(req, res) {
  if (req.method == "GET") {
    try {
      const result = await getAllCategories();
      return successResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  return errorResponse(req, res, "method not allowed", 405);
}
