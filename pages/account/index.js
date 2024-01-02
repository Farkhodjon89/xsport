import Layout from '../../components/Layout'
import { StaticDataSingleton } from '../../utils/staticData'
import useUser from '../../utils/useUser'
import Authorization from '../../components/Authorization'
import { useRouter } from 'next/router'
const Account = ({ categories }) => {
  const router = useRouter()
  const { ref } = router.query
  useUser({ redirectTo: '/account/orders', redirectIfFound: true })
  return (
    <Layout categories={categories}>
      <Authorization referralCode={ref} />
    </Layout>
  )
}

export async function getStaticProps() {
  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch()

  const categories = staticData.getRootCategories()

  return {
    props: {
      categories: categories.allCategories || null,
    },
    revalidate: 60,
  }
}

export default Account
