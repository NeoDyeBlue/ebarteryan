import { successResponse, errorResponse } from "../../../utils/response-utils";
import { getToken } from "next-auth/jwt";
import { submitReview } from "../../../lib/data-access/review";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    if (req.method == "POST") {
      if (token && token.verified) {
        const { user, item, rate, review } = req.body;
        // console.log(req.body);
        const reviewData = await submitReview(
          token?.sub,
          user,
          item,
          rate,
          review
        );
        return successResponse(req, res, reviewData);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
