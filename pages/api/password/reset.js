import { sendPasswordResetRequest } from "../../../lib/data-access/user";
import { successResponse, errorResponse } from "../../../utils/response-utils";
import absoluteUrl from "next-absolute-url";
export default async function handler(req, res) {
  try {
    if (req.method == "POST") {
      const { origin } = absoluteUrl(req);
      const { resend } = req.query;

      const { email } = req.body;
      const resetRequest = await sendPasswordResetRequest(
        email,
        origin,
        resend == "true" ? true : false
      );
      return successResponse(req, res, resetRequest);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
