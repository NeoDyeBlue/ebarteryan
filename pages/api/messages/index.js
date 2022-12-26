import { successResponse, errorResponse } from "../../../utils/response-utils";
import { createConversation } from "../../../lib/controllers/message-controller";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    if (req.method == "POST") {
      if (token && token.verified) {
        const { receiver, item, offer } = req.body;
        const conversation = await createConversation(
          token?.sub,
          receiver,
          item,
          offer
        );
        return successResponse(req, res, conversation);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    //   if (req.method == "GET") {
    //     const query = req.query;
    //     const items = await getItemsAggregate(token?.sub, "all", query);
    //     return successResponse(req, res, items);
    //   }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
