import { getUserOffers } from "../../../lib/controllers/offer-controller";
import { successResponse, errorResponse } from "../../../utils/response-utils";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    if (req.method == "GET" && token && token.verified) {
      const { page, limit, status = "all" } = req.query;
      const data = await getUserOffers(token?.sub, status, page, limit);
      return successResponse(req, res, data);
    }
    return errorResponse(req, res, "unauthorized request", 401);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
