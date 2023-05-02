import { getUserInfo } from "../../../lib/data-access/user";
import { successResponse, errorResponse } from "../../../utils/response-utils";

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      const { user } = req.query;
      const userInfo = await getUserInfo(user);
      return successResponse(req, res, userInfo);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
