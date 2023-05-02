import { successResponse, errorResponse } from "../../../utils/response-utils";
import {
  createConversation,
  getMessages,
} from "../../../lib/data-access/message";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    if (token && token.verified) {
      if (req.method == "POST") {
        const { receiver, item, offer } = req.body;
        const conversation = await createConversation(
          token?.sub,
          receiver,
          item,
          offer
        );
        return successResponse(req, res, conversation);
      }
      if (req.method == "GET") {
        const { page, limit, search } = req.query;
        const conversations = await getMessages(
          token?.sub,
          page,
          limit,
          search
        );
        return successResponse(req, res, conversations);
      }
      return errorResponse(req, res, "method not allowed", 405);
    }
    return errorResponse(req, res, "unauthorized request", 401);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
