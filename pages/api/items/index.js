import { successResponse, errorResponse } from "../../../utils/response-utils";
import { addItem, getItems } from "../../../lib/controllers/item-controller";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    if (token && token.verified) {
      console.log(req.method);
      if (req.method == "POST") {
        const item = await addItem({ user: token.sub, ...req.body });
        return successResponse(req, res, item);
      }
      if (req.method == "GET") {
        const query = req.query;
        const items = await getItems("all", query);
        return successResponse(req, res, items);
      }
      return errorResponse(req, res, "method not allowed", 405);
    }
    return errorResponse(req, res, "unauthorized request", 401);
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
