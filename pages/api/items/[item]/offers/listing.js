import {
  getItemOffers,
  createOffer,
  offerFromListing,
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
    if (req.method == "POST") {
      if (token && token.verified) {
        const { listingItem } = req.body;
        const offer = await offerFromListing(item, listingItem, token?.sub);

        return successResponse(req, res, offer);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
