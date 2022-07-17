import React from 'react';
import Layout from '../../components/Layout';
import Breadcrumbs from '../../components/Breadcrumbs';
import Catalog from '../../components/Catalog';
import client from '../../apollo/apollo-client';
import PRODUCTS from '../../queries/products';
import { StaticDataSingleton } from '../../utils/staticData';
import { v4 as uuidv4 } from 'uuid';

const CatalogPage = ({ pageInfo, products, category, categories, activeTerms }) => {
  const categoriesFilter = categories.map(({ name, slug }) => ({
    name,
    link: `/catalog/${slug}`,
  }));

  const breadcrumbs = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Каталог',
      link: `/catalog`,
    },
  ];
  // console.log(categories);
  return (
    <>
      <Layout categories={categories}>
        <div className="container">
          <Breadcrumbs path={breadcrumbs} />
          <Catalog
            key={uuidv4()}
            products={products}
            categories={categoriesFilter}
            pageInfo={pageInfo}
            category={category}
            activeTerms={activeTerms}
          />
        </div>
      </Layout>
    </>
  );
};

export default CatalogPage;

export async function getServerSideProps() {
  const staticData = new StaticDataSingleton();
  await staticData.checkAndFetch();

  const categories = staticData.getRootCategories();

  const products = await client.query({
    fetchPolicy: 'no-cache',
    query: PRODUCTS,
    variables: { first: 9 },
  });


  return {
    props: {
      products: products.data.products.nodes,
      pageInfo: products.data.products.pageInfo,
      activeTerms: products.data.products.activeTerms,
      categories: categories,

    },
  };
}
