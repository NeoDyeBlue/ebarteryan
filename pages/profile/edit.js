import NavLayout from "../../components/Layouts/NavLayout";
import Head from "next/head";
import Image from "next/image";
import { InputField } from "../../components/Inputs";
import { Button } from "../../components/Buttons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useFilePicker } from "use-file-picker";
import { UserProfile, Account, Pen } from "@carbon/icons-react";
import { useState, useEffect } from "react";

export default function EditProfile() {
  const [profileFormData, setProfileFormData] = useState({
    firstName: "",
    lastName: "",
    image: {
      id: null,
      url: "",
    },
  });
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 3,
  });
  useEffect(() => {
    if (filesContent.length) {
      setProfileFormData((prev) => ({
        ...prev,
        image: { ...prev.image, url: filesContent[0].content },
      }));
    }
  }, [filesContent]);
  return (
    <div className="w-full">
      <Head>
        <title>Edit Profile | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto min-h-screen">
        <div className="mx-auto flex w-full max-w-[680px] flex-col gap-1 py-4">
          <h1 className="border-b border-gray-100 py-4 text-2xl font-semibold md:py-6 md:text-3xl">
            Settings
          </h1>
          <Tabs className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[auto_2fr]">
            <TabList className="flex w-full items-start gap-4 sm:w-[200px] sm:flex-col sm:gap-3 sm:pb-4">
              <Tab className="tab" selectedClassName="tab-active">
                <UserProfile size={24} />
                <p>Profile</p>
              </Tab>
              <Tab className="tab" selectedClassName="tab-active">
                <Account size={24} />
                <p>Account</p>
              </Tab>
            </TabList>
            <div>
              <TabPanel>
                <form className="flex w-full flex-col gap-4 md:py-5">
                  <div className="flex flex-col gap-2">
                    <p className="font-display font-medium">Profile Picture</p>
                    <div className="relative h-[150px] w-[150px]">
                      <span
                        className="absolute top-0 right-0 z-10 flex h-[36px] w-[36px] items-center
                      justify-center rounded-full border border-gray-100 bg-white shadow-md"
                      >
                        <Pen size={20} />
                      </span>
                      <button
                        onClick={openFileSelector}
                        type="button"
                        className="relative h-full w-full overflow-hidden rounded-full shadow-md"
                      >
                        <Image
                          src={
                            profileFormData.image.url
                              ? profileFormData.image.url
                              : "https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                          }
                          layout="fill"
                          objectFit="cover"
                        />
                      </button>
                    </div>
                  </div>
                  <InputField
                    label="First Name"
                    name="firstName"
                    placeholder="First Name"
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    placeholder="Last Name"
                  />
                  <div className="mt-4">
                    <Button autoWidth={true}>Save Changes</Button>
                  </div>
                </form>
              </TabPanel>
              <TabPanel>
                <form className="flex w-full flex-col gap-4 md:py-5">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="youremail@mail.com"
                    infoMessage="changing email needs revalidation"
                  />
                  <InputField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                  />
                  <InputField
                    label="New Password"
                    name="newPassword"
                    type="password"
                  />
                  <div className="mt-4">
                    <Button autoWidth={true}>Save Changes</Button>
                  </div>
                </form>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

EditProfile.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
