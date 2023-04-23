import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import { getReviews } from "../../../../lib/controllers/review-controller";

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      const { user, page, limit } = req.query;
      const reviews = await getReviews(user, page, limit);
      return successResponse(req, res, reviews);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
