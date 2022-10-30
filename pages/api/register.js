import { successResponse, errorResponse } from "../../utils/response-utils";
import absoluteUrl from "next-absolute-url";
import { register } from "../../lib/controllers/user-controller";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      console.log("called");
      const { firstName, lastName, email, password } = req.body;
      const { origin } = absoluteUrl(req);
      const user = await register(firstName, lastName, email, password, origin);
      successResponse(req, res, user);
    } catch (error) {
      errorResponse(req, res, error.message, 400, error.name);
    }
  }
}
