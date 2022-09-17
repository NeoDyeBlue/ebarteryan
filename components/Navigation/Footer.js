import FooterLinkList from "../FooterLinkList";
import FooterLinkListItem from "../FooterLinkListItem";
import { LogoFacebook, LogoTwitter } from "@carbon/icons-react";

export default function Footer() {
  return (
    <footer className="bg-white-dark border-t border-t-gray-100">
      <div className="container mx-auto flex flex-col py-10 gap-9">
        <div className="flex flex-col gap-9 md:items-start md:flex-row md:justify-between">
          <span className="font-display font-semibold text-2xl md:text-4xl">
            eBarterYan
          </span>
          <FooterLinkList title="Listings">
            <FooterLinkListItem to="/" name="Test1" />
            <FooterLinkListItem to="/" name="Test2" />
            <FooterLinkListItem to="/" name="Test3" />
            <FooterLinkListItem to="/" name="Test4" />
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
        <p className="mx-auto text-gray-400 text-xs">
          © 2022 EBarterYan. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
