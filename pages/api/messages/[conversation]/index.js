import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import {
  getChats,
  createChat,
} from "../../../../lib/controllers/message-controller";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    const { conversation } = req.query;
    // if (req.method == "POST") {
    //   if (token && token.verified) {
    //     const { conversation, images, body } = req.body;
    //     const chat = await createChat(
    //       token?.sub,
    //       conversation,
    //       images,
    //       body
    //     );
    //     return successResponse(req, res, chat);
    //   }
    //   return errorResponse(req, res, "unauthorized request", 401);
    // }
    if (req.method == "GET") {
      if (token && token.verified) {
        const { page, limit } = req.query;
        const chats = await getChats(token?.sub, conversation, page, limit);
        return successResponse(req, res, chats);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
