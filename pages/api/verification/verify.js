import { successResponse, errorResponse } from "../../../utils/response-utils";
import { verify } from "../../../lib/controllers/user-controller";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    if (req.method == "PATCH") {
      const token = await getToken({ req });
      if (token) {
        const { otp } = req.body;
        const result = await verify(token.email, otp);
        return successResponse(req, res, result);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
