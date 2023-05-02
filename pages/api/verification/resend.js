import { successResponse, errorResponse } from "../../../utils/response-utils";
import { verificationResend } from "../../../lib/data-access/user";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      const token = await getToken({ req });
      if (token) {
        const result = await verificationResend(token.sub);
        return successResponse(req, res, result);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
