import Layout from '../../../components/Layout'
import Breadcrumbs from '../../../components/Breadcrumbs'
import Catalog from '../../../components/Catalog'
import client from '../../../apollo/apollo-client'
import PRODUCTS from '../../../queries/products'
import { PAGESETTINGS } from '../../../queries/categoryPageSettings'
import { StaticDataSingleton } from '../../../utils/staticData'
import CategoriesSlider from '../../../components/CategoriesSlider/categories-slider'

const CatalogPage = ({
  products,
  category,
  parentCategory,
  pageInfo,
  categories,
  subCategories,
  activeTerms,
}) => {
  const categoriesFilter = category?.children?.map(({ name, slug }) => ({
    name,
    link: `/catalog/${parentCategory?.slug}/${slug}`,
  }))

  const isSale = parentCategory && parentCategory.slug === category.slug
  // console.log(parentCategory)

  const breadcrumbs = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: parentCategory.name,
      link: `/catalog/${parentCategory.slug}`,
    },
    {
      name: isSale ? 'Sale' : category.name,
      link: isSale
        ? `/catalog/${category.slug}/sale`
        : `/catalog/${category.slug}`,
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
              activeTerms={activeTerms}
              products={products}
              categories={categoriesFilter}
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

export const getStaticPaths = async () => {
  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch()

  const men = []
  const women = []
  const children = []

  staticData.getAllChildrenSlugs('muzhchinam', men)
  staticData.getAllChildrenSlugs('zhenshhinam', women)
  staticData.getAllChildrenSlugs('detyam', children)

  const paths = [
    ...men.map((slug) => ({ params: { parent: 'muzhchinam', slug } })),
    ...women.map((slug) => ({ params: { parent: 'zhenshhinam', slug } })),
    ...children.map((slug) => ({ params: { parent: 'detyam', slug } })),
  ]

  return {
    paths,
    fallback: 'blocking',
    // fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch()

  const categories = staticData.getRootCategories()

  const parentCategory = staticData.getCategoryBySlug(params.parent, 1)

  const category = staticData.getCategoryBySlug(
    params.slug === 'sale'
      ? params.parent
      : params.slug === 'newProducts'
      ? params.parent
      : params.slug,
    2
  )
  const today = new Date()
  today.setDate(today.getDate() - 14)

  let products

  if (params.slug === 'newProducts') {
    products = await client.query({
      query: PRODUCTS,
      variables: {
        first: 8,
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        categories: [params.parent],
      },
    })
  } else {
    products = await client.query({
      query: PRODUCTS,
      variables: {
        first: 9,
        categories: params.slug !== 'sale' ? [params.slug] : [params.parent],
        onSale: params.slug === 'sale' ? true : null,
      },
    })
  }

  // console.log(params.slug)

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
      parentCategory: parentCategory || null,
      category: JSON.parse(JSON.stringify(category)) || null,
      categories: categories.allCategories || null,
      subCategories: pageData?.data?.productCategory?.children?.nodes || null,
      // newProducts: newProducts.data.products.nodes
    },
    revalidate: 60,
  }
}

export default CatalogPage
