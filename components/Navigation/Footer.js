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
    categories.data.map((category, index) => (
      <FooterLinkListItem
        key={index}
        to={`/${category.name}`}
        name={category.name}
      />
    ));
  return (
    <footer className="border-t border-t-gray-100 bg-white-dark">
      <div className="container mx-auto flex flex-col gap-9 py-10">
        <div className="flex flex-col gap-9 md:flex-row md:items-start md:justify-between">
          <span className="font-display text-2xl font-semibold md:text-4xl">
            eBarterYan
          </span>
          <FooterLinkList title="Listings">
            <FooterLinkListItem to="/items" name="All Items" />
            {categoryListItems}
          </FooterLinkList>
          <FooterLinkList title="Account">
            {session && session.user.verified && status == "authenticated" ? (
              <>
                <FooterLinkListItem to="/profile" name="Profile" />
                <FooterLinkListItem to="/offers" name="Offers" />
                <FooterLinkListItem to="/notifications" name="Notifications" />
                <FooterLinkListItem to="/messages" name="Messages" />
              </>
            ) : (
              <>
                <FooterLinkListItem to="/login" name="Login" />
                <FooterLinkListItem to="/signup" name="Sign Up" />
              </>
            )}
          </FooterLinkList>
          <div className="flex items-center gap-4">
            <Link href="/">
              <a>
                <LogoFacebook size={36} />
              </a>
            </Link>
            <Link href="/">
              <a>
                <LogoTwitter size={36} />
              </a>
            </Link>
          </div>
        </div>
        <p className="mx-auto text-xs text-gray-400">
          © 2022 EBarterYan. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
