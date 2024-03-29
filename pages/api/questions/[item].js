import {
  askQuestion,
  answerQuestion,
  getQuestions,
} from "../../../lib/data-access/question";
import { getToken } from "next-auth/jwt";
import { successResponse, errorResponse } from "../../../utils/response-utils";

export default async function handler(req, res) {
  try {
    const { item } = req.query;
    if (req.method == "GET") {
      const { page, limit } = req.query;
      const questions = await getQuestions(item, page, limit);
      return successResponse(req, res, questions);
    }
    if (req.method == "POST") {
      console.log(item);
      const token = await getToken({ req });
      if (token && token.verified) {
        const { question } = req.body;
        const data = await askQuestion(item, token?.sub, question);
        return successResponse(req, res, data);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    if (req.method == "PATCH") {
      const token = await getToken({ req });
      if (token && token.verified) {
        console.log("answer");
        const { questionId, answer } = req.body;
        const data = await answerQuestion(item, token?.sub, questionId, answer);
        return successResponse(req, res, data);
      }
      return errorResponse(req, res, "unauthorized request", 401);
    }
    return errorResponse(req, res, "method not allowed", 405);
  } catch (error) {
    return errorResponse(req, res, error.message, 400, error.name);
  }
}
