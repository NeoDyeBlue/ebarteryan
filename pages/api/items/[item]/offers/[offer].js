import {
  successResponse,
  errorResponse,
} from "../../../../../utils/response-utils";
import { getToken } from "next-auth/jwt";
import { acceptOffer } from "../../../../../lib/controllers/offer-controller";

export default async function handler(req, res) {
  try {
    const { item, offer } = req.query;
    const token = await getToken({ req });
    if (req.method == "PATCH") {
      if (token && token.verified) {
        if (Object.keys(req.body).includes("accepted")) {
          const { accepted } = req.body;
          const data = await acceptOffer(offer, token?.sub, item, accepted);
          return successResponse(req, res, data);
        }
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
