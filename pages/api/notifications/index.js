import { getNotifications } from "../../../lib/controllers/notification-controller";
import { successResponse, errorResponse } from "../../../utils/response-utils";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      const token = await getToken({ req });
      if (token && token?.sub) {
        const { page, limit, unread } = req.query;
        const notifications = await getNotifications(
          token?.sub,
          unread,
          page,
          limit
        );
        return successResponse(req, res, notifications);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
