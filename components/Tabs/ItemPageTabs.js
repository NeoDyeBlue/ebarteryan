import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  OfferList,
  OfferListItem,
  QuestionAnswerList,
  QuestionAnswerListItem,
} from "../Lists";
import { UserOfferCard } from "../Cards";
import { DotLoader } from "react-spinners";
import { Button } from "../Buttons";
import { useState, useEffect } from "react";
import useUserOfferStore from "../../store/useUserOfferStore";
import { Textarea } from "../Inputs";
import useSocketStore from "../../store/useSocketStore";
import { toast } from "react-hot-toast";
import { FormikProvider, Form, useFormik } from "formik";
import useQuestionAnswerStore from "../../store/useQuestionAnswerStore";
import useItemOffersStore from "../../store/useItemOffersStore";
import useItemIdStore from "../../store/useItemIdStore";

/**
 *
 * @param {*} obj
 * @param {*} key
 * @param {*} value
 * @returns Object result
 * @see {@link https://stackoverflow.com/questions/15523514/find-by-key-deep-in-a-nested-array}
 */

function findNestedObj(obj, key, value) {
  try {
    JSON.stringify(obj, (_, nestedValue) => {
      if (nestedValue && nestedValue[key] === value) throw nestedValue;
      return nestedValue;
    });
  } catch (result) {
    return result;
  }
}

export default function ItemPageTabs({
  itemId,
  offersPaginate,
  questionsPaginate,
  showUserControls,
  hasUserOffer,
}) {
  //swr
  const {
    data: questions,
    totalDocs: totalQuestionDocs,
    isEndReached: questionsEndReached,
    isLoading: questionsLoading,
    size: questionsSize,
    setSize: setQuestionsSize,
    mutate: mutateQuestions,
  } = questionsPaginate;

  const {
    data: offers,
    totalDocs: totalOfferDocs,
    isEndReached: offersEndReached,
    isLoading: offersLoading,
    size: offersSize,
    setSize: setOffersSize,
    mutate: mutateOffers,
  } = offersPaginate;

  //states
  const [isQuestionSubmitting, setIsQuestionSubmitting] = useState(false);

  //stores
  const { isSubmitting, isSubmitSuccess, resubmit, offer } =
    useUserOfferStore();
  const { socket } = useSocketStore();
  const {
    questions: storedQuestions,
    setQuestions,
    totalQuestions,
    setTotalQuestions,
  } = useQuestionAnswerStore();
  const {
    offers: storedOffers,
    setOffers,
    totalOffers,
    setTotalOffers,
  } = useItemOffersStore();
  const { item, setItem } = useItemIdStore();

  //elements
  const itemQuestions =
    storedQuestions.length &&
    storedQuestions
      .map((page) => page.data.docs)
      .flat()
      .map((question) => (
        <QuestionAnswerListItem
          key={question._id}
          data={question}
          withInput={showUserControls}
        />
      ));

  const itemOffers =
    storedOffers?.length &&
    storedOffers
      .map((page) => page.data.docs)
      .flat()
      .map((offer) => (
        <OfferListItem
          key={offer._id}
          offer={offer}
          withButtons={showUserControls}
        />
      ));

  //effects
  //   useLayoutEffect(() => {
  //     setItem(itemId);
  //   }, [itemId, setItem]);

  useEffect(() => {
    if (
      (questions && questions.length >= storedQuestions.length) ||
      itemId !== item
    ) {
      setQuestions(questions || []);
      if (totalQuestionDocs >= totalQuestions || itemId !== item) {
        setTotalQuestions(totalQuestionDocs);
      }
      if (itemId !== item) {
        setItem(itemId);
      }
    }
  }, [
    questions,
    setQuestions,
    storedQuestions,
    setTotalQuestions,
    totalQuestionDocs,
    totalQuestions,
    itemId,
    item,
    setItem,
  ]);

  useEffect(() => {
    if ((offers && offers.length >= storedOffers.length) || itemId !== item) {
      setOffers(offers || []);
      if (totalOfferDocs >= totalOffers || itemId !== item) {
        setTotalOffers(totalOfferDocs);
      }
      if (itemId !== item) {
        setItem(itemId);
      }
    }
  }, [
    offers,
    setOffers,
    storedOffers,
    setTotalOffers,
    totalOfferDocs,
    totalOffers,
    itemId,
    item,
    setItem,
  ]);

  useEffect(() => {
    if (socket) {
      socket.on("another-offer", (offer) => {
        if (offersEndReached || !offers || !itemOffers.length) {
          const updatedOffers = storedOffers.length
            ? [...storedOffers, offer]
            : [offer];
          setOffers(updatedOffers);
        }
        setTotalOffers(offer.data.totalDocs);
      });

      socket.on("new-question", (question) => {
        console.log(question);
        if (questionsEndReached || !questions || !itemQuestions.length) {
          const updatedQuestions = storedQuestions.length
            ? [...storedQuestions, question]
            : [question];
          setQuestions(updatedQuestions);
        }
        setTotalQuestions(question.data.totalDocs);
      });

      socket.on("answered-question", (answeredQuestion) => {
        const questionExists = findNestedObj(
          storedQuestions,
          "_id",
          answeredQuestion._id
        );
        console.log(answeredQuestion);
        if (questionExists) {
          const updatedQuestions = JSON.parse(
            JSON.stringify(storedQuestions, (_, nestedValue) => {
              if (nestedValue && nestedValue["_id"] == answeredQuestion._id) {
                return answeredQuestion;
              }
              return nestedValue;
            })
          );
          setQuestions(updatedQuestions);
        }
      });
    }
  }, [
    socket,
    offersEndReached,
    itemOffers?.length,
    offers,
    itemQuestions?.length,
    questionsEndReached,
    questions,
    setQuestions,
    setTotalQuestions,
    storedQuestions,
    setOffers,
    setTotalOffers,
    storedOffers,
  ]);
  //formik
  const questionFormik = useFormik({
    initialValues: {
      question: "",
    },
    // validationSchema: questionSchema,
    onSubmit: handleQuestionSubmit,
  });

  //funcs
  async function handleQuestionSubmit(values) {
    if (values.question) {
      setIsQuestionSubmitting(true);
      const res = await fetch(`/api/questions/${itemId}`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        socket.emit("question", {
          question: result,
          room: result.data.docs[0].item,
        });
        questionFormik.setFieldValue("question", "");
        toast.success("Question asked");
      } else {
        toast.error("Can't post question");
      }
      setIsQuestionSubmitting(false);
    }
  }

  return (
    <Tabs
      defaultIndex={0}
      className="container mx-auto grid grid-cols-1 items-start gap-6 sm:grid-cols-[auto_2fr] lg:max-w-[1200px]"
    >
      <TabList className="flex w-full items-start gap-4 sm:h-full sm:w-[200px] sm:flex-col sm:gap-6">
        <Tab className="tab-varying" selectedClassName="tab-active">
          <p>Offers</p>
          <span className="rounded-[10px] bg-gray-100 px-2 py-1 text-sm">
            {totalOffers}
          </span>
        </Tab>
        <Tab className="tab-varying" selectedClassName="tab-active">
          <p>Questions</p>
          <span className="rounded-[10px] bg-gray-100 px-2 py-1 text-sm">
            {totalQuestions}
          </span>
        </Tab>
      </TabList>
      <div>
        <TabPanel className="flex flex-col gap-10">
          {offer ? (
            <div
              // id="offers"
              className="flex scroll-mt-40 flex-col gap-2 border-b border-b-gray-100 pb-4"
            >
              <p className="font-display text-lg font-semibold">Your Offer</p>
              <UserOfferCard
                offer={offer}
                isLoading={
                  hasUserOffer
                    ? false
                    : isSubmitting && !isSubmitSuccess
                    ? true
                    : false
                }
                isSubmitSuccess={hasUserOffer ? true : isSubmitSuccess}
                retryHandler={resubmit}
              />
            </div>
          ) : null}
          {itemOffers?.length ? (
            <div className="flex flex-col gap-2 pb-4">
              <p className="font-display text-lg font-semibold">Offers</p>
              <OfferList>{itemOffers}</OfferList>
            </div>
          ) : !offersEndReached ? (
            <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
              <DotLoader color="#C7EF83" size={32} />
            </div>
          ) : (
            <p className="m-auto flex min-h-[300px] max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
              No Offers
            </p>
          )}
          {offersLoading && (
            <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
              <DotLoader color="#C7EF83" size={32} />
            </div>
          )}
          {(!offersEndReached || !offers) && !offersLoading ? (
            <div className="mx-auto mb-8 w-full max-w-[200px]">
              <Button
                secondary={true}
                onClick={() => setOffersSize(offersSize + 1)}
              >
                Load More
              </Button>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            {!showUserControls && (
              <FormikProvider value={questionFormik}>
                <Form className="flex flex-col gap-4">
                  <p className="font-display text-lg font-semibold">
                    Ask a Question
                  </p>
                  <div className="flex flex-row items-end gap-2">
                    <Textarea
                      placeholder="Type here..."
                      name="question"
                      value={questionFormik.values.question}
                    />
                    <Button
                      autoWidth={true}
                      type="submit"
                      disabled={isQuestionSubmitting}
                    >
                      {isQuestionSubmitting ? (
                        <DotLoader color="#fff" size={24} />
                      ) : (
                        <p>Ask</p>
                      )}
                    </Button>
                  </div>
                </Form>
              </FormikProvider>
            )}
            {itemQuestions?.length ? (
              <div className="flex flex-col gap-2 pb-4">
                <p className="font-display text-lg font-semibold">Questions</p>
                <QuestionAnswerList>{itemQuestions}</QuestionAnswerList>
              </div>
            ) : !questionsEndReached ? (
              <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
                <DotLoader color="#C7EF83" size={32} />
              </div>
            ) : (
              <p className="m-auto flex min-h-[300px] max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                No Questions
              </p>
            )}
            {questionsLoading && (
              <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
                <DotLoader color="#C7EF83" size={32} />
              </div>
            )}
            {(!questionsEndReached || !questions) && !questionsLoading ? (
              <div className="mx-auto mb-8 w-full max-w-[200px]">
                <Button
                  secondary={true}
                  onClick={() => setQuestionsSize(questionsSize + 1)}
                >
                  Load More
                </Button>
              </div>
            ) : null}
          </div>
        </TabPanel>
      </div>
    </Tabs>
  );
}
