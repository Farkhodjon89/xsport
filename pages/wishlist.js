import React from 'react';
import { HeadData } from '../components/Head';
import Layout from '../components/Layout';
import WishlistMain from '../components/WishlistMain';
import { StaticDataSingleton } from '../utils/staticData';

const Wishlist = ({ categories }) => {
  return (
    <>
      <HeadData title={'Cписок желаний'} pageUrl="/wishlist" />
      <Layout categories={categories}>
        <WishlistMain />
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  const staticData = new StaticDataSingleton();
  await staticData.checkAndFetch(true);

  const categories = staticData.getRootCategories();

  return {
    props: {
      categories: categories.allCategories,
    },
    revalidate: 60,
  };
}

export default Wishlist;
