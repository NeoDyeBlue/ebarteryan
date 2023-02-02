import { updateProfile } from "../../../lib/controllers/user-controller";
import { successResponse, errorResponse } from "../../../utils/response-utils";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    const token = await getToken({ req });
    if (token && token.verified) {
      if (req.method == "PATCH") {
        const updatedProfile = await updateProfile(token.sub, req.body);
        return successResponse(req, res, updatedProfile);
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
