import Layout from '../../components/Layout'
import AdminMain from '../../components/AdminMain'
import { StaticDataSingleton } from '../../utils/staticData'
import useUser from '../../utils/useUser'
import Authorization from '../../components/Authorization'
import AccountNav from '../../components/AccountNav'
import Breadcrumbs from '../../components/Breadcrumbs'
import AccountOrder from '../../components/AccountOrder'
import AccountHeading from '../../components/AccountHeading'
import { useRouter } from 'next/router'
import WishlistMain from '../../components/WishlistMain'
import AccountSettings from '../../components/AccountSettings'

const Account = ({ categories }) => {
  useUser({ redirectTo: '/account' })
  const { userData } = useUser()

  const path = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Аккаунт',
      link: `/account/orders`,
    },
    {
      name: 'Мои данные',
      link: `/`,
    },
  ]

  if (!userData?.isLoggedIn) {
    return null
  }

  return (
    <Layout categories={categories}>
      <div className='container'>
        <Breadcrumbs path={path} />
        <AccountHeading firstName={userData ? userData.user.firstName : null} />
        <div className='row'>
          <div className='col-lg-3'>
            <AccountNav />
          </div>
          <div className='col-lg-8 offset-lg-1'>
            <AccountSettings />
          </div>
        </div>
      </div>
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
