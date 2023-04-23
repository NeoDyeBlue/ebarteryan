import {
  updateOffer,
  deleteOffer,
} from "../../../lib/controllers/offer-controller";
import { successResponse, errorResponse } from "../../../utils/response-utils";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const { offer } = req.query;
    const token = await getToken({ req });
    if (token && token.verified) {
      if (req.method == "PATCH") {
        const updatedData = await updateOffer(token?.sub, offer, req.body);
        return successResponse(req, res, updatedData);
      }
      if (req.method == "DELETE") {
        const result = await deleteOffer(token?.sub, offer);
        return successResponse(req, res, result);
      }
      return errorResponse(req, res, "method not allowed", 405);
    }
    return errorResponse(req, res, "unauthorized request", 401);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
