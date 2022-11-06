import Head from "next/head";
import { LocationBarterButtons } from "../components/Buttons";
import { ItemCard } from "../components/Cards";
import { NavLayout, CategoryLayout } from "../components/Layouts";
import useSWR from "swr";
import { ItemCardSkeleton } from "../components/Loaders";

export default function Home() {
  return (
    <NavLayout>
      <CategoryLayout>
        <div className="flex w-full flex-col gap-4">
          <Head>
            <title>eBarterYan | Barter Items at your Town</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <LocationBarterButtons />
          <div className="container relative mx-auto">
            <div
              className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 pb-4 
           lg:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] lg:gap-6 lg:py-6"
            >
              {[...Array(8)].map((_, i) => (
                <ItemCardSkeleton key={i} />
              ))}
              <ItemCard
                name="Product Test"
                description="A valid product description"
                offers={1}
                time="7d"
                to="/1/1"
              />
              <ItemCard
                name="Product Test"
                description="A valid product description"
                offers={1}
                time="7d"
                to="/"
              />
              <ItemCard
                name="Product Test"
                description="A valid product description a very very very long description with a story of some sort"
                offers={1}
                time="7d"
                to="/"
              />
              <ItemCard
                name="Product Test"
                description="A valid product description"
                offers={1}
                time="7d"
                to="/"
              />
              <ItemCard
                name="Product Test"
                description="A valid product description"
                offers={1}
                time="7d"
                to="/"
              />
              <ItemCard
                name="Product Test"
                description="A valid product description"
                offers={1}
                time="7d"
                to="/"
              />
              <ItemCard
                name="Product Test"
                description="A valid product description"
                offers={1}
                time="7d"
                to="/"
              />
              <ItemCard
                name="Product Test"
                description="A valid product description"
                offers={1}
                time="7d"
                to="/"
              />
              <ItemCard
                name="Product Test"
                description="A valid product description"
                offers={1}
                time="7d"
                to="/"
              />
            </div>
          </div>
        </div>
      </CategoryLayout>
    </NavLayout>
  );
}

// Home.getLayout = function getLayout(page) {
//   return (
//     <NavLayout>
//       <CategoryLayout />
//       {page}
//     </NavLayout>
//   );
// };
