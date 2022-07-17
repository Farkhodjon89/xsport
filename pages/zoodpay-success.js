import React from 'react'
import Layout from '../components/Layout'
import WishlistMain from '../components/WishlistMain'
import { StaticDataSingleton } from '../utils/staticData'

const Wishlist = ({ categories }) => {
  return (
    <>
      <Layout categories={categories}>
        <div className='zoodpay'>
          Благодарим за покупку! <br /> Наш консультант выйдет на связь с вами в
          ближайшее время.
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
