import Link from "next/link";

export default function FooterLinkListItem({ to, name }) {
  return (
    <li>
      <Link href={to}>
        <a className="hover:text-green-500">{name}</a>
      </Link>
    </li>
  );
}
