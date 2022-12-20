import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import { getUserReviewInfo } from "../../../../lib/controllers/review-controller";

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      const { user } = req.query;
      const reviewsInfo = await getUserReviewInfo(user);
      return successResponse(req, res, reviewsInfo);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
