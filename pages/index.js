import Layout from '../components/Layout';
import {StaticDataSingleton} from '../utils/staticData';
import {HOME_PAGE} from '../queries/globalSettings';
import client from '../apollo/apollo-client';
import PRODUCTS from '../queries/products';
// import { POSTS } from '../queries/posts';
// import {PAGESETTINGS} from "../queries/categoryPageSettings";
import MainSlider from '../components/MainSlider';
import ProductSlider from '../components/ProductSlider';
import Banner from '../components/Banner';
import CategoriesList from '../components/CategoriesList';
// import PostsList from '../components/PostsList/postslist';

const Index = ({
                 categories,
                 slides,
                 featuredProducts,
                 homeCategories,
                 banners,
                 newProducts,
                 discountedProducts,
                 pumaProducts,
               }) => {
  return (
      <>
        <Layout categories={categories}>
          <MainSlider sliderData={slides}/>
          <div className="container">
            <CategoriesList categories={homeCategories}/>
            <ProductSlider products={featuredProducts} title={`Популярные Товары`}/>
            {/*<Banner banners={banners[0]} />*/}
            <ProductSlider products={discountedProducts} title={`Товары со Скидкой`}/>
            {/*<Banner banners={banners[1]} />*/}
            <ProductSlider products={pumaProducts} title={`Energy wear X Puma`}/>
            {newProducts.length !== 0 ? <ProductSlider products={newProducts} title={`Новинка`}/> : ''}

            {/* <PostsList posts={posts} /> */}
          </div>
        </Layout>
      </>
  );
};

export async function getStaticProps() {
  const staticData = new StaticDataSingleton();
  await staticData.checkAndFetch(true);
  const categories = staticData.getRootCategories();

  const homePageData = await client.query({
    query: HOME_PAGE,
  });

  const featuredProducts = await client.query({
    query: PRODUCTS,
    variables: {first: 8, featured: true},
  });

  const discountedProducts = await client.query({
    query: PRODUCTS,
    variables: {first: 8, onSale: true},
  });

  const pumaProducts = await client.query({
    query: PRODUCTS,
    variables: {
      first: 8,
      filters: [
        {
          taxonomy: 'PABRAND',
          terms: ['PUMA'],
        },
      ],
    },
  });

  const today = new Date()
  today.setDate(today.getDate() - 14)

  const newProducts = await client.query({
    query: PRODUCTS,
    variables: {first: 8, day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear()},
  });


  // const recommendedProducts = await client.query({
  //   query: PRODUCTS,
  //   variables: {first: 8, categories: ['kuhonnye-instrumenty']}
  // })

  // const posts = await client.query({
  //   query: POSTS,
  //   variables: { first: 2 },
  // });

  // const products1 = await client.query({
  //   query: PRODUCTS,
  //   fetchPolicy: 'no-cache',
  //   variables: {
  //     first: 10,
  //
  //   },
  // })

  return {
    props: {
      // posts: posts.data.products.nodes,
      categories: categories.allCategories,
      featuredProducts: featuredProducts.data.products.nodes,
      // recommendedProducts: recommendedProducts.data.products.nodes,
      slides: homePageData.data.themeGeneralSettings.globalOptions?.slider,
      homeCategories: homePageData.data.themeGeneralSettings.globalOptions?.categories,
      // products1: products1.data.products.nodes,
      // offers: homePageData.data.themeGeneralSettings.globalOptions?.offers,
      banners: homePageData.data.themeGeneralSettings.globalOptions?.banners,
      discountedProducts: discountedProducts.data.products.nodes,
      pumaProducts: pumaProducts.data.products.nodes,
      newProducts: newProducts.data.products.nodes
    },
    revalidate: 60,
  };
}

export default Index;
