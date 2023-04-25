import { successResponse, errorResponse } from "../../../utils/response-utils";
import { addItem, getItemsAggregate } from "../../../lib/data-access/item";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    if (req.method == "POST") {
      if (token && token.verified) {
        const item = await addItem({ user: token.sub, ...req.body });
        return successResponse(req, res, item);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    if (req.method == "GET") {
      const query = req.query;
      const items = await getItemsAggregate(token?.sub, "all", query);
      return successResponse(req, res, items);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
