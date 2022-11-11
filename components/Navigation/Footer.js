import { FooterLinkList, FooterLinkListItem } from "../Lists";
import { LogoFacebook, LogoTwitter } from "@carbon/icons-react";
import useSWR from "swr";

export default function Footer() {
  const { data: categories, error } = useSWR("/api/categories");
  const categoryListItems =
    categories?.success &&
    categories.data.map((category, index) => (
      <FooterLinkListItem
        key={index}
        to={`/items/${category.name}`}
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
          <FooterLinkList title="Listings">
            <FooterLinkListItem to="/" name="Test1" />
            <FooterLinkListItem to="/" name="Test2" />
            <FooterLinkListItem to="/" name="Test3" />
            <FooterLinkListItem to="/" name="Test4" />
          </FooterLinkList>
          <div className="flex items-center gap-4">
            <a href="/">
              <LogoFacebook size={36} />
            </a>
            <a href="/">
              <LogoTwitter size={36} />
            </a>
          </div>
        </div>
        <p className="mx-auto text-xs text-gray-400">
          © 2022 EBarterYan. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
