import Layout from '../../../components/Layout'
import Breadcrumbs from '../../../components/Breadcrumbs'
import client from '../../../apollo/apollo-client'
import PRODUCTS from '../../../queries/products'
import Catalog from '../../../components/Catalog'
import { PAGESETTINGS } from '../../../queries/categoryPageSettings'
import { StaticDataSingleton } from '../../../utils/staticData'
import CategoriesSlider from '../../../components/CategoriesSlider/categories-slider'

const CatalogPage = ({
  pageInfo,
  products,
  subCategories,
  category,
  parentCategory,
  categories,
  activeTerms,
}) => {
  const categoriesFilter = category?.children?.map(({ name, slug }) => ({
    name,
    link: `/catalog/${category.slug}/${slug}`,
  }))

  const breadcrumbs = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: category.name,
      link: `/catalog/${category.slug}`,
    },
  ]

  return (
    <>
      <Layout categories={categories}>
        <div className='container'>
          <div className='catalog'>
            <Breadcrumbs path={breadcrumbs} />
            <CategoriesSlider
              categories={subCategories}
              parentCategory={parentCategory}
            />
            <Catalog
              key={category.id}
              products={products}
              categories={categoriesFilter}
              activeTerms={activeTerms}
              pageInfo={pageInfo}
              category={category}
              parentCategory={parentCategory}
            />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default CatalogPage

export const getStaticPaths = async () => {
  const paths = ['zhenshhinam', 'muzhchinam', 'detyam'].map((x) => ({
    params: { parent: x },
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch()
  const category = staticData.getCategoryBySlug(params.parent, 1)
  const categories = staticData.getRootCategories()

  const today = new Date()
  today.setDate(today.getDate() - 14)

  const newProducts = await client.query({
    query: PRODUCTS,
    variables: {
      first: 8,
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    },
  })

  const products = await client.query({
    query: PRODUCTS,
    variables: { first: 9, categories: [params.parent] },
  })

  const pageData = await client.query({
    query: PAGESETTINGS,
    fetchPolicy: 'no-cache',
    variables: { id: params.parent },
  })
  return {
    props: {
      products: products.data.products.nodes || null,
      pageInfo: products.data.products.pageInfo || null,
      activeTerms: products.data.products.activeTerms || null,
      category: category || null,
      parentCategory: params.parent || null,
      categories: categories.allCategories || null,
      subCategories: pageData.data?.productCategory?.children?.nodes || null,
      newProducts: newProducts.data.products.nodes || null,
    },
    revalidate: 60,
  }
}
