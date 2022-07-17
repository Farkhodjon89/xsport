import React from 'react';
import Layout from '../components/Layout';
import CartMain from '../components/CartMain';
import { StaticDataSingleton } from '../utils/staticData';
import { HeadData } from '../components/Head';

const Cart = ({ categories }) => {
  // console.log(categories)
  return (
    <>
      <HeadData title={'Корзина'} pageUrl="/cart" />
      <Layout categories={categories}>
        <CartMain />
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

export default Cart;
