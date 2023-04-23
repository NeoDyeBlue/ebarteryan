import { resetPassword } from "../../../lib/controllers/user-controller";
import { successResponse, errorResponse } from "../../../utils/response-utils";

export default async function handler(req, res) {
  try {
    if (req.method == "PATCH") {
      const { password, token } = req.body;
      const result = await resetPassword(token, password);
      return successResponse(req, res, result);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
