import React from 'react'
import Layout from '../components/Layout'
// import WishlistMain from '../components/WishlistMain'
import { StaticDataSingleton } from '../utils/staticData'

const Wishlist = ({ categories }) => {
  return (
    <>
      <Layout categories={categories}>
        <div className='zoodpay'>
          Не получилось завершить транзакцию. <br /> Убедитесь, что вы ввели
          правильные данные и попробуйте снова.
        </div>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch(true)

  const categories = staticData.getRootCategories()

  return {
    props: {
      categories: categories.allCategories,
    },
    revalidate: 60,
  }
}

export default Wishlist
