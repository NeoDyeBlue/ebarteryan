import { successResponse, errorResponse } from "../../utils/response-utils";
import { verify } from "../../lib/data-access/user";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method == "PATCH") {
    try {
      const token = await getToken({ req });
      if (token) {
        const { otp } = req.body;
        const result = await verify(token.email, otp);
        return successResponse(req, res, result);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
}
