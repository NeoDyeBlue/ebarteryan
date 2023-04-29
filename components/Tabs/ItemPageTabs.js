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
import { Warning } from "@carbon/icons-react";

export default function ItemPageTabs({
  itemId,
  itemLister,
  offersPaginated,
  questionsPaginated,
  showUserControls,
  available,
  onOfferAcceptChange,
  isAcceptedOfferRemoved = false,
  onUserOfferEdit,
}) {
  //swr
  const [isAcceptedRemoved, setIsAcceptedRemoved] = useState(
    isAcceptedOfferRemoved
  );
  const {
    data: questions,
    totalDocs: totalQuestionDocs,
    isEndReached: questionsEndReached,
    isLoading: questionsLoading,
    size: questionsSize,
    setSize: setQuestionsSize,
    mutate: mutateQuestions,
    isValidating: questionsValidating,
  } = questionsPaginated;

  const {
    data: offers,
    totalDocs: totalOfferDocs,
    isEndReached: offersEndReached,
    isLoading: offersLoading,
    size: offersSize,
    setSize: setOffersSize,
    mutate: mutateOffers,
    isValidating: offersValidating,
  } = offersPaginated;

  //states
  const [isQuestionSubmitting, setIsQuestionSubmitting] = useState(false);

  //stores
  const {
    tempOffer,
    isSubmitting,
    isSubmitSuccess,
    resubmit,
    offer,
    isForUpdating,
  } = useUserOfferStore();
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
    acceptedOffer,
  } = useItemOffersStore();

  //elements
  const itemQuestions =
    storedQuestions?.length &&
    storedQuestions.map((question) => (
      <QuestionAnswerListItem
        key={question._id}
        data={question}
        withInput={showUserControls}
      />
    ));

  const itemOffers =
    storedOffers?.length &&
    storedOffers.map((offer) => {
      return (
        <OfferListItem
          key={offer._id}
          offer={offer}
          onAcceptChange={handleOfferAcceptChange}
          withButtons={showUserControls && available}
        />
      );
    });

  useEffect(() => {
    setQuestions(questions);
    setTotalQuestions(totalQuestionDocs);
  }, [
    socket,
    itemId,
    questions,
    setQuestions,
    totalQuestionDocs,
    setTotalQuestions,
  ]);

  useEffect(() => {
    setOffers(offers);
    setTotalOffers(totalOfferDocs);
  }, [socket, itemId, offers, setOffers, totalOfferDocs, setTotalOffers]);

  useEffect(() => {
    if (socket) {
      socket.on("offer:add", (offer) => {
        setOffers([offer, ...storedOffers]);
      });

      socket.on("question:add", (question) => {
        setQuestions([question, ...storedQuestions]);
      });

      socket.on("offer:update-count", (count) => {
        setTotalOffers(count);
      });

      socket.on("question:update-count", (count) => {
        setTotalQuestions(count);
      });

      socket.emit("offer:count", itemId);
      socket.emit("question:count", itemId);

      return () => {
        socket.off("offer:add");
        socket.off("question:add");
        socket.off("offer:update-count");
        socket.off("question:update-count");
      };
    }
  }, [
    itemId,
    socket,
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
        socket.emit("question:create", {
          question: result.data,
          room: result.data.item,
        });
        setQuestions([result.data, ...storedQuestions]);
        questionFormik.setFieldValue("question", "");
        toast.success("Question asked");
      } else {
        toast.error("Can't post question");
      }
      setIsQuestionSubmitting(false);
    }
  }

  function handleOfferAcceptChange(accepted) {
    onOfferAcceptChange(accepted);
    // const updatedOffers = storedOffers.filter(
    //   (storedOffer) => storedOffer._id !== offer._id
    // );
    // setOffers(updatedOffers);
    setIsAcceptedRemoved(false);
    mutateOffers();
  }

  // console.log({ isSubmitting, isSubmitSuccess, isForUpdating });

  return (
    <Tabs
      defaultIndex={0}
      className="container mx-auto grid grid-cols-1 items-start gap-6 sm:grid-cols-[auto_2fr] lg:max-w-[1200px]"
    >
      <TabList className="flex w-full items-start gap-4 sm:h-full sm:w-[180px] sm:flex-col sm:gap-6">
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
          {isAcceptedRemoved && showUserControls && !acceptedOffer ? (
            <div className="flex w-full items-center gap-2 rounded-[10px] border border-gray-100 p-4">
              <Warning size={56} className="text-gray-200" />
              <p className="text-sm text-gray-200">
                The offer you accepted has been removed for its violations. Your
                item is now made unavailable but you can toggle it back if you
                want to accept more offers. Please be reminded to accept offers
                more carefully!
              </p>
            </div>
          ) : null}
          {(tempOffer || offer) && (
            <div className="flex scroll-mt-40 flex-col gap-2 border-b border-b-gray-100 pb-4">
              <p className="font-display text-xl font-semibold">
                {offer && acceptedOffer && offer._id == acceptedOffer._id
                  ? "Yours & Accepted Offer"
                  : "Your Offer"}
              </p>
              <UserOfferCard
                offer={tempOffer || offer}
                isLoading={
                  offer && !isForUpdating
                    ? false
                    : isSubmitting && !isSubmitSuccess
                  // ? true
                  // : false
                }
                isSubmitSuccess={
                  offer && !isForUpdating ? true : isSubmitSuccess
                }
                retryHandler={resubmit}
                itemLister={itemLister}
                onEdit={onUserOfferEdit}
                isAccepted={
                  offer && acceptedOffer && offer._id == acceptedOffer._id
                }
              />
            </div>
          )}
          {acceptedOffer && !offer && (
            <div className="flex scroll-mt-40 flex-col gap-2 border-b border-b-gray-100 pb-4">
              <p className="font-display text-xl font-semibold">
                Accepted Offer
              </p>
              <OfferListItem
                onAcceptChange={handleOfferAcceptChange}
                offer={acceptedOffer}
                withButtons={showUserControls}
                withoutBorder
              />
            </div>
          )}
          {itemOffers?.length && (
            <div className="flex flex-col gap-2 pb-4">
              <p className="font-display text-xl font-semibold">Offers</p>
              <OfferList>{itemOffers}</OfferList>
            </div>
          )}
          {(!offersEndReached || offersLoading) && (
            <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
              <DotLoader color="#C7EF83" size={32} />
            </div>
          )}
          {!itemOffers.length &&
            !acceptedOffer &&
            !offer &&
            !offersValidating && (
              <p className="m-auto flex min-h-[300px] max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                No Offers
              </p>
            )}
          {/* {offersLoading && (
            <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
              <DotLoader color="#C7EF83" size={32} />
            </div>
          )} */}
          {!offersEndReached && !offersLoading ? (
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
                  <p className="font-display text-xl font-semibold">
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
            {itemQuestions?.length && (
              <div className="flex flex-col gap-2 pb-4">
                <p className="font-display text-xl font-semibold">Questions</p>
                <QuestionAnswerList>{itemQuestions}</QuestionAnswerList>
              </div>
            )}{" "}
            {!questionsEndReached || questionsLoading ? (
              <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
                <DotLoader color="#C7EF83" size={32} />
              </div>
            ) : null}
            {!itemQuestions.length && !questionsValidating && (
              <p className="m-auto flex min-h-[300px] max-w-[60%] flex-col items-center justify-center gap-2 text-center font-display text-xl text-gray-200/70">
                No Questions
              </p>
            )}
            {/* {questionsLoading && (
              <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
                <DotLoader color="#C7EF83" size={32} />
              </div>
            )} */}
            {!questionsEndReached && !questionsLoading ? (
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
