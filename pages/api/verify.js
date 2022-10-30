import { successResponse, errorResponse } from "../../utils/response-utils";
import { verify } from "../../lib/controllers/user-controller";

export default async function handler(req, res) {
  if (req.method == "PATCH") {
    try {
      const { token } = req.query;
      const result = await verify(token);
      successResponse(req, res, result);
    } catch (error) {
      errorResponse(req, res, error.message, 400, error.name);
    }
  }
}
