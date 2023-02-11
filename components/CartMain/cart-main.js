import s from './cart-main.module.scss'
import Link from 'next/link'
import SectionTitle from '../SectionTitle'
import icons from '../../public/fixture'
import { v4 as uuidv4 } from 'uuid'
import { connect } from 'react-redux'
import { addToCart, deleteFromCart } from '../../redux/actions/cartActions'
import {
  addToWishlist,
  deleteFromWishlist,
} from '../../redux/actions/wishlistActions'
import { getPrice, getFormat, getDiscount } from '../../utils'
import { useEffect, useState } from 'react'
import Breadcrumbs from '../Breadcrumbs'
import OrderReview from '../OrderReview'
import Offer from '../Offer'
import COUPON from '../../queries/coupon'
import { useLazyQuery } from '@apollo/react-hooks'
import client from '../../apollo/apollo-client'
import CouponModal from '../CouponModal'
import Image from 'next/image'

const path = [
  { link: '/', name: 'Главная' },
  { link: '/cart', name: 'Корзина' },
]

const CartMain = ({
  cartItems,
  wishlistItems,
  deleteFromCart,
  addToWishlist,
  deleteFromWishlist,
}) => {
  const [loadCupon, { data, loading, error }] = useLazyQuery(COUPON, {
    client,
  })
  const [name, setName] = useState('')
  const [activeCoupon, setActiveCoupon] = useState(false)
  const [myCoupon, setMyCoupon] = useState(
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('coupon'))
      : ' '
  )
  const [active, setActive] = useState(myCoupon ? true : false)

  const sendCoupon = () => {
    loadCupon({
      variables: {
        id: name,
      },
    })
  }

  useEffect(() => {
    if (data && data.coupon) {
      localStorage.setItem('coupon', JSON.stringify(data.coupon))
      setMyCoupon(JSON.parse(localStorage.getItem('coupon')))
    }
  }, [data])

  let orderReviewData = {
    price: 0,
    sale: 0,
    totalPrice: 0,
    couponFront: 0,
  }

  cartItems.map((product) => {
    const { normalPrice, salePrice } = getPrice(product)
    orderReviewData.price += parseInt(normalPrice) * product.quantity
    orderReviewData.sale += product.onSale
      ? parseInt(normalPrice) - parseInt(salePrice) * product.quantity
      : 0
    orderReviewData.totalPrice = orderReviewData.price - orderReviewData.sale
  })

  if (myCoupon && myCoupon.amount) {
    switch (myCoupon.discountType) {
      case 'FIXED_CART':
        orderReviewData.sale += myCoupon.amount
        orderReviewData.totalPrice -= myCoupon.amount
        break
      case 'PERCENT':
        orderReviewData.sale +=
          (orderReviewData.totalPrice * myCoupon.amount) / 100
        orderReviewData.totalPrice = Math.round(
          orderReviewData.totalPrice -
            (orderReviewData.totalPrice * myCoupon.amount) / 100
        )

        break
      default:
        break
    }

    localStorage.setItem('cartTotalPrice', JSON.stringify(orderReviewData))
  }

  const [windowWidth, setWindowWidth] = useState()
  let resizeWindow = () => {
    setWindowWidth(window.screen.width)
  }
  useEffect(() => {
    resizeWindow()
    window.addEventListener('resize', resizeWindow)
    return () => window.removeEventListener('resize', resizeWindow)
  }, [])

  const wishlistItem = wishlistItems.filter(
    (wishlistItem) => wishlistItem.id === cartItems.id
  )[0]

  return cartItems.length >= 1 ? (
    <div className='container'>
      <Breadcrumbs path={path} />
      <SectionTitle title='Корзина' />
      <div className={`row ${s.cards}`}>
        <div className={`${s.left} col-lg-8 col-12`}>
          {active ? (
            <div className={s.coupon}>
              <div className={s.left}>
                <div dangerouslySetInnerHTML={{ __html: icons.coupon }} />
                Промокод <div className={s.name}> {myCoupon.code} </div>{' '}
                активирован!
              </div>
              <div className={s.right}>
                <button
                  className={s.active}
                  onClick={() => {
                    setMyCoupon(localStorage.removeItem('cartTotalPrice'))
                    setName('')
                    setActive(false)
                  }}
                >
                  Отменить
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeCoupon ? (
                <>
                  <CouponModal
                    activeCoupon={activeCoupon}
                    setActiveCoupon={setActiveCoupon}
                    sendCoupon={sendCoupon}
                    error={error}
                    setName={setName}
                    name={name}
                    myCoupon={myCoupon}
                    setActive={setActive}
                    loading={loading}
                  />
                </>
              ) : null}
              <div className={s.coupon}>
                <div className={s.left}>
                  <div dangerouslySetInnerHTML={{ __html: icons.coupon }} />
                  {windowWidth <= 991
                    ? 'У вас есть Промокод ?'
                    : 'Если у вас есть Купон вы можете активировать'}
                </div>
                <div className={s.right}>
                  <button
                    className={s.active}
                    onClick={() => setActiveCoupon(true)}
                  >
                    Активировать
                  </button>
                </div>
              </div>
            </>
          )}
          <div className={s.cardlist}>
            {cartItems.map((product) => {
              const { normalPrice, salePrice } = getPrice(product)
              const normalPriceFront = getFormat(normalPrice) + ' UZS'
              const salePriceFront = getFormat(salePrice) + ' UZS'

              const wishlistItem = wishlistItems.filter(
                (wishlistItem) => wishlistItem.id === product.id
              )[0]

              return (
                <div className={s.card} key={uuidv4()}>
                  <Image
                    src={product.image ? product.image.sourceUrl : null}
                    alt='cart_item_img'
                    width={160}
                    height={238}
                  />

                  <div className={s.details}>
                    <div className={s.title}>
                      <div className={s.name}>{product.name}</div>
                      <div className={s.price}>
                        {product.onSale ? (
                          <>
                            <span className={s.salePrice}>
                              {' '}
                              {salePriceFront}{' '}
                            </span>
                            <span className={s.normalPrice}>
                              {normalPriceFront}
                            </span>
                          </>
                        ) : (
                          <span>{normalPriceFront}</span>
                        )}
                      </div>
                    </div>
                    <div className={s.brand}>
                      {product?.paBrands?.nodes[0]?.name
                        ? product.paBrands.nodes[0].name
                        : null}
                    </div>

                    <div className={s.color}>
                      Цвет <span> {product.selectedProductColor}</span>
                    </div>
                    <div className={s.flex}>
                      <div className={s.size}>
                        Размер <span>{product.selectedProductSize}</span>
                      </div>
                      <div className={s.stock}>
                        Кол-во <span>1</span>
                      </div>
                    </div>
                    <div className={s.cardBottom}>
                      <div className={s.remove}>
                        <div
                          dangerouslySetInnerHTML={{ __html: icons.remove }}
                        />
                        <button
                          onClick={() =>
                            deleteFromCart(product.selectedProductId)
                          }
                        >
                          Удалить
                        </button>
                      </div>
                      <div
                        className={`${s.wishlist} ${
                          wishlistItem ? s.active : null
                        }`}
                      >
                        <button
                          onClick={
                            wishlistItem
                              ? () => deleteFromWishlist(product)
                              : () => addToWishlist(product)
                          }
                          dangerouslySetInnerHTML={{ __html: icons.wishlist }}
                        />
                        {wishlistItem ? (
                          <div className={s.fav}>Избранное</div>
                        ) : (
                          'Добавить в избранное'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <Offer />
        </div>

        <div className={`${s.right} col-lg-4 col-12`}>
          <div className={s.orderReview}>
            <OrderReview data={orderReviewData} />
          </div>
          <div className={s.toOrder}>
            <Link href='/application'>
              <a>Оформить заказ</a>
            </Link>
          </div>
          <div className={s.toCatalog}>
            <Link href='/catalog'>
              <a>
                <span
                  dangerouslySetInnerHTML={{ __html: icons.fullArrowLeft }}
                />
                Продолжить покупки
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={s.emptyCart}>
      Корзина пуста
      <Link href='/catalog'>
        <a>Начать покупки</a>
      </Link>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item) => {
      dispatch(addToCart(item))
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

export default connect(mapStateToProps, mapDispatchToProps)(CartMain)
