import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import {
  getChats,
  deleteConversation,
} from "../../../../lib/controllers/message-controller";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    const { conversation } = req.query;
    if (token && token.verified) {
      if (req.method == "GET") {
        const { page, limit } = req.query;
        const chats = await getChats(token?.sub, conversation, page, limit);
        return successResponse(req, res, chats);
      }
      if (req.method == "DELETE") {
        const result = await deleteConversation(conversation, token?.sub);
        return successResponse(req, res, result);
      }
      return errorResponse(req, res, "method not allowed", 405);
    }
    return errorResponse(req, res, "unauthorized request", 401);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
