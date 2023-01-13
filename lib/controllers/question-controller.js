import dbConnect from "../dbConnect";
import Item from "../models/Item";
import Question from "../models/Question";
import mongoose from "mongoose";
import User from "../models/User";

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

export async function askQuestion(item, user, question) {
  try {
    await dbConnect();

    const itemData = await Item.findById(item).exec();

    if (!itemData) {
      let itemError = new Error("Item not found");
      itemError.name = "ItemError";
      throw itemError;
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

    const totalQuestions = await Question.countDocuments({ item });

    return { question: questionData, totalQuestions };
  } catch (error) {
    throw error;
  }
}

export async function answerQuestion(item, user, questionId, answer) {
  try {
    await dbConnect();
    const itemData = await Item.findById(item).select("user").exec();
    if (!itemData) {
      let itemError = new Error("Item not found");
      itemError.name = "ItemError";
      throw itemError;
    }

    if (itemData.user != user) {
      let forbiddenError = new Error(
        "Can't answer item question that is not posted by you"
      );
      forbiddenError.name = "ForbiddenError";
      throw forbiddenError;
    }

    const questionExists = await Question.findById(questionId).exec();

    if (!questionExists) {
      let questionError = new Error("Question not found");
      questionError.name = "ItemError";
      throw questionError;
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

export async function countItemQuestions(item) {
  await dbConnect();
  try {
    const questionCount = await Question.countDocuments({ item }).exec();

    return questionCount;
  } catch (error) {
    throw error;
  }
}
