import Head from "next/head";
import LocationBarterButtons from "../components/LocationBarterButtons";
import ItemCard from "../components/Cards/ItemCard";
import NavLayout from "../components/Layouts/NavLayout";
import CategoryLayout from "../components/Layouts/CategoryLayout";

export default function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>eBarterYan | Barter Items at your Town</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LocationBarterButtons />
      <div className="container mx-auto relative">
        <div
          className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 pb-4 
           lg:gap-6 lg:py-6 lg:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]"
        >
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
  );
}

Home.getLayout = function getLayout(page) {
  return (
    <NavLayout>
      <CategoryLayout />
      {page}
    </NavLayout>
  );
};