import {
  successResponse,
  errorResponse,
} from "../../../../utils/response-utils";
import { getUserItems } from "../../../../lib/data-access/item";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      let { user, status, page, limit } = req.query;
      let drafts = status == "drafts" ? true : false;
      let unavailable = status == "unavailable" ? true : false;
      let ended = status == "ended" ? true : false;
      let asOffer = status == "offered" ? true : false;
      if (drafts) {
        const token = await getToken({ req });
        if (
          token &&
          token.sub !== user &&
          (status == "drafts" || status == "unavailable")
        ) {
          drafts = false;
          unavailable = false;
        }
      }
      const items = await getUserItems(
        user,
        drafts,
        unavailable,
        asOffer,
        ended,
        page,
        limit
      );
      return successResponse(req, res, items);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
