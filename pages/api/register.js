import { successResponse, errorResponse } from "../../utils/response-utils";
import absoluteUrl from "next-absolute-url";
import { register } from "../../lib/data-access/user";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const { firstName, lastName, email, password } = req.body;
      const { origin } = absoluteUrl(req);
      const user = await register(firstName, lastName, email, password, origin);
      return successResponse(req, res, user);
    } catch (error) {
      return errorResponse(req, res, error.message, 400, error.name);
    }
  }
  return errorResponse(req, res, "method not allowed", 405);
}
