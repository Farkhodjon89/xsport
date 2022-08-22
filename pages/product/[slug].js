import Layout from '../../components/Layout'
import Breadcrumbs from '../../components/Breadcrumbs'
import ProductCard from '../../components/ProductCard'
import client from '../../apollo/apollo-client'
import { useState } from 'react'
import PRODUCT from '../../queries/product'
// import PRODUCTS, { PRODUCTS_SLUG } from '../../queries/products';
import { connect } from 'react-redux'
import { getPrice } from '../../utils'
import TOPCOLORS from '../../queries/topColors'
import { addToCart, deleteFromCart } from '../../redux/actions/cartActions'
import {
  addToWishlist,
  deleteFromWishlist,
} from '../../redux/actions/wishlistActions'
import { StaticDataSingleton } from '../../utils/staticData'

const Product = ({
  product,
  contacts,
  cartItems,
  wishlistItems,
  addToCart,
  deleteFromCart,
  addToWishlist,
  deleteFromWishlist,
  categories,
  topColors,
}) => {
  const [openCart, setOpenCart] = useState(false)

  const path = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: product.name,
      link: `/product/${product.slug}`,
    },
  ]
  const { normalPrice, salePrice } = getPrice(product)
  return (
    <>
      <Layout
        parentCategory={
          product.productCategories.nodes.length != 0
            ? product.productCategories.nodes[0].slug
            : null
        }
        categories={categories}
        openCart={openCart}
        setOpenCart={setOpenCart}
      >
        <div className='container'>
          <Breadcrumbs path={path} />
          <ProductCard
            topColors={topColors}
            product={product}
            contacts={contacts}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
            addToCart={addToCart}
            deleteFromCart={deleteFromCart}
            addToWishlist={addToWishlist}
            deleteFromWishlist={deleteFromWishlist}
            getActiveStatus={(r) => setOpenCart(r)}
          />
        </div>
      </Layout>
    </>
  )
}

// export const getStaticPaths = async () => {
//   const paths = []
//
//   const fetchProducts = async (after) => {
//     const _tempProductsResult = await client.query({
//       query: PRODUCTS_SLUG,
//       variables: {
//         ...(after ? { after } : {}),
//       },
//     })
//
//     paths.push(
//       ..._tempProductsResult.data.products.nodes.map((product) => ({
//         params: { slug: product.slug },
//       }))
//     )
//
//     if (_tempProductsResult.data.products.pageInfo.hasNextPage) {
//       await fetchProducts(_tempProductsResult.data.products.pageInfo.endCursor)
//     }
//   }
//
//   if (process.env.NODE_ENV === 'production') {
//     await fetchProducts()
//   }
//   return {
//     paths,
//     fallback: 'blocking',
//   }

export async function getServerSideProps({ params }) {
  let response

  try {
    response = await client.query({
      query: PRODUCT,
      variables: { id: params.slug },
    })
  } catch (e) {
    return {
      notFound: true,
    }
  }

  let topColors
  try {
    topColors = await client.query({
      query: TOPCOLORS,
      variables: { terms: response.data.product.sku },
    })
  } catch (e) {
    console.log(e)

    return {
      notFound: true,
    }
  }

  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch()
  const categories = staticData.getRootCategories()
  return {
    props: {
      product: response.data.product,
      topColors: topColors.data.products.nodes,
      categories: categories.allCategories,
    },
  }
}

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (
      item,
      selectedProductColor,
      selectedProductSize,
      selectedProductId
    ) => {
      dispatch(
        addToCart(
          item,
          selectedProductColor,
          selectedProductSize,
          selectedProductId
        )
      )
    },
    deleteFromCart: (item) => {
      dispatch(deleteFromCart(item))
    },
    addToWishlist: (item) => {
      dispatch(addToWishlist(item))
    },
    deleteFromWishlist: (item) => {
      dispatch(deleteFromWishlist(item))
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Product)
