import dbConnect from "../dbConnect";
import Item from "../models/Item";
import Question from "../models/Question";
import mongoose from "mongoose";
import User from "../models/User";
import errorThrower from "../../utils/error-utils";

/**
 * gets the questions/answers of an item with pagination
 * @param {String} item
 * @param {Number} page
 * @param {Number} limit
 * @returns
 */

export async function getQuestions(item, page, limit) {
  try {
    await dbConnect();
    const questions = await Question.paginate(
      { item },
      {
        sort: { createdAt: -1 },
        ...(page && limit ? { page, limit } : {}),
        populate: {
          path: "user",
          select: "firstName lastName image",
          model: User,
        },
      }
    );

    return { docs: questions.docs, totalDocs: questions.totalDocs };
  } catch (error) {}
}

/**
 * asks a question about the item
 * @param {String} item
 * @param {String} user
 * @param {String} question
 * @returns
 */

export async function askQuestion(item, user, question) {
  try {
    await dbConnect();

    const itemData = await Item.findById(item).exec();

    if (!itemData) {
      throw errorThrower("ItemError", "Item not found");
    }

    const _id = new mongoose.Types.ObjectId();

    const newQuestion = new Question({
      _id,
      user,
      item,
      question,
    });

    await newQuestion.save();

    const questionData = await Question.findById(_id)
      .populate("user", "firstName lastName image", User)
      .exec();

    return questionData;
  } catch (error) {
    throw error;
  }
}

/**
 * answers the question about the item
 * @param {String} item
 * @param {String} user
 * @param {String} questionId
 * @param {String} answer
 * @returns
 */

export async function answerQuestion(item, user, questionId, answer) {
  try {
    await dbConnect();
    const itemData = await Item.findById(item).select("user").exec();
    if (!itemData) {
      throw errorThrower("ItemError", "Item not found");
    }

    if (itemData.user != user) {
      throw errorThrower(
        "ForbiddenError",
        "Can't answer item question that is not posted by you"
      );
    }

    const questionExists = await Question.findById(questionId).exec();

    if (!questionExists) {
      throw errorThrower("QuestionError", "Can't find the question");
    }

    const answeredQuestion = await Question.findByIdAndUpdate(
      questionId,
      { answer },
      { new: true }
    ).populate("user", "firstName lastName fullName image", User);

    return answeredQuestion;
  } catch (error) {
    throw error;
  }
}

/**
 * counts the questions of an item
 * @param {String} item
 * @returns
 */

export async function countItemQuestions(item) {
  await dbConnect();
  try {
    const questionCount = await Question.countDocuments({ item }).exec();

    return questionCount;
  } catch (error) {
    throw error;
  }
}
