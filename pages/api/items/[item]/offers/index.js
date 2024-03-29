import {
  getItemOffers,
  createOffer,
} from "../../../../../lib/data-access/offer";
import {
  successResponse,
  errorResponse,
} from "../../../../../utils/response-utils";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const { item } = req.query;
    const token = await getToken({ req });
    if (req.method == "GET") {
      const { page, limit } = req.query;
      const data = await getItemOffers(item, token?.sub, page, limit);
      return successResponse(req, res, data);
    }
    if (req.method == "POST") {
      if (token && token.verified) {
        const offer = await createOffer({
          item,
          user: token?.sub,
          ...req.body,
        });

        return successResponse(req, res, offer);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
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
