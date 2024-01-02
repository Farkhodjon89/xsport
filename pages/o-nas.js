import Layout from '../components/Layout'
import client from '../apollo/apollo-client'
import { GETPAGEBYSLUG } from '../queries/pages'
import { StaticDataSingleton } from '../utils/staticData'
import Breadcrumbs from '../components/Breadcrumbs'
import PageInfo from '../components/PageInfo/page-info'
import { HeadData } from '../components/Head'

const AboutUs = ({ categories, pageContent }) => {
  const path = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'О нас',
      link: '/o-nas',
    },
  ]
  return (
    <>
      <HeadData title={'О нас'} pageUrl='/o-nas' />
      <Layout categories={categories}>
        <div className='container'>
          <Breadcrumbs path={path} />
          <PageInfo pageContent={pageContent} />
        </div>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch(false)
  const categories = staticData.getRootCategories()

  const page = await client.query({
    query: GETPAGEBYSLUG,
    variables: {
      id: 'https://xsportwp.billz.work/o-nas',
    },
  })

  return {
    props: {
      categories: categories.allCategories || null,
      pageContent: page.data.page || null,
    },
    revalidate: 60,
  }
}

export default AboutUs
