import { FooterLinkList, FooterLinkListItem } from "../Lists";
import { LogoFacebook, LogoTwitter } from "@carbon/icons-react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Footer() {
  const { data: categories, error } = useSWR("/api/categories");
  const { data: session, status } = useSession();
  const categoryListItems =
    categories?.success &&
    categories.data.map((category, index) => {
      if (category.name !== "others") {
        return (
          <FooterLinkListItem
            key={index}
            to={`/${category.name}`}
            name={category.name}
          />
        );
      }
    });
  return (
    <footer className="border-t border-t-gray-100 bg-white-dark">
      <div className="container mx-auto flex flex-col gap-9 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <span className="font-display text-2xl font-semibold md:text-4xl">
            eBarterYan
          </span>
          <FooterLinkList title="Listings">
            <FooterLinkListItem to="/items" name="All Items" />
            {categoryListItems}
            <FooterLinkListItem to="/others" name="Others" />
          </FooterLinkList>
          <FooterLinkList title="Account">
            {session && status == "authenticated" ? (
              <>
                <FooterLinkListItem to="/profile" name="Profile" />
                <FooterLinkListItem to="/offers" name="Offers" />
                <FooterLinkListItem to="/notifications" name="Notifications" />
                <FooterLinkListItem to="/messages" name="Messages" />
                <FooterLinkListItem
                  to="/terms-and-conditions"
                  name="Terms & Conditions"
                />
              </>
            ) : (
              !session && (
                <>
                  <FooterLinkListItem to="/login" name="Login" />

                  <FooterLinkListItem to="/signup" name="Sign Up" />
                  <FooterLinkListItem
                    to="/terms-and-conditions"
                    name="Terms & Conditions"
                  />
                </>
              )
            )}
          </FooterLinkList>
          {/* <div className="flex items-center gap-4 self-end lg:self-start">
            <Link href="https://facebook.com">
              <a>
                <LogoFacebook size={36} />
              </a>
            </Link>
            <Link href="https://twitter.com">
              <a>
                <LogoTwitter size={36} />
              </a>
            </Link>
          </div> */}
        </div>
        <p className="mx-auto text-xs text-gray-400">
          © 2023 EBarterYan. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
