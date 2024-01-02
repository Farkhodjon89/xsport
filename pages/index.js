import Layout from '../components/Layout'
import { StaticDataSingleton } from '../utils/staticData'
import { HOME_PAGE } from '../queries/globalSettings'
import client from '../apollo/apollo-client'
import PRODUCTS from '../queries/products'
import MainSlider from '../components/MainSlider'
import ProductSlider from '../components/ProductSlider'
import CategoriesList from '../components/CategoriesList'

const Index = ({
  categories,
  slides,
  homeCategories,
  featuredProducts,
  discountedProducts,
  pumaProducts,
}) => {
  return (
    <>
      <Layout categories={categories}>
        <MainSlider sliderData={slides?.filter((el) => !!el?.subtitle)} />
        <div className='container'>
          <CategoriesList categories={homeCategories} />
          {!!featuredProducts?.length && (
            <ProductSlider
              products={featuredProducts}
              title={`Популярные Товары`}
            />
          )}
          {!!discountedProducts?.length && (
            <ProductSlider
              products={discountedProducts}
              title={`Товары со Скидкой`}
            />
          )}
          {!!pumaProducts?.length && (
            <ProductSlider
              products={pumaProducts}
              title={`Energy wear X Nike`}
            />
          )}
        </div>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch(true)
  const categories = staticData.getRootCategories()

  const homePageData = await client.query({
    query: HOME_PAGE,
  })

  const featuredProducts = await client.query({
    query: PRODUCTS,
    variables: { first: 8, featured: true },
  })

  const discountedProducts = await client.query({
    query: PRODUCTS,
    variables: { first: 8, onSale: true },
  })

  const pumaProducts = await client.query({
    query: PRODUCTS,
    variables: {
      first: 8,
      filters: [
        {
          taxonomy: 'PABRAND',
          terms: ['NIKE'],
        },
      ],
    },
  })

  return {
    props: {
      categories: categories?.allCategories || null,
      slides:
        homePageData?.data?.themeGeneralSettings?.globalOptions?.slider || null,
      homeCategories:
        homePageData.data.themeGeneralSettings.globalOptions?.categories ||
        null,
      featuredProducts: featuredProducts.data.products.nodes || null,
      discountedProducts: discountedProducts.data.products.nodes || null,
      pumaProducts: pumaProducts.data.products.nodes || null,
    },
    revalidate: 60,
  }
}

export default Index
