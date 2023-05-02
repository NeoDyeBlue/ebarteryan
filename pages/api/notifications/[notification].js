import { updateNotificationRead } from "../../../lib/data-access/notification";
import { successResponse, errorResponse } from "../../../utils/response-utils";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    if (req.method == "PATCH") {
      const token = await getToken({ req });
      if (token && token?.sub) {
        const { notification } = req.query;
        const notificationUnreadCount = await updateNotificationRead(
          token?.sub,
          notification
        );
        return successResponse(req, res, notificationUnreadCount);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
