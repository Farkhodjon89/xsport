import s from './product-card.module.scss'
// import PorductsList from '../../components/ProductsList'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getPrice, getFormat } from '../../utils'
import Slider from 'react-slick'
import React from 'react'
import Link from 'next/link'
import Accordion from '../Accordion'
import InstantBuyModal from '../InstantBuyModal'
import icons from '../../public/fixture'
import Tabs from '../Tabs'
import Offer from '../Offer'
import ProductSlider from '../ProductSlider'
import AddToCartModal from '../AddToCartModal'
// import InnerImageZoom from 'react-inner-image-zoom'
// import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import { LightgalleryProvider, LightgalleryItem } from 'react-lightgallery'
import Image from 'next/image'

const ProductCard = ({
  product,
  topColors,
  cartItems,
  wishlistItems,
  addToCart,
  deleteFromCart,
  addToWishlist,
  deleteFromWishlist,
  getActiveStatus,
}) => {
  const [selectedProductId, setSelectedProductId] = useState(
    product.variations
      ? product.variations.nodes[0].databaseId
      : product.databaseId
  )

  const [selectedProductStock, setSelectedProductStock] = useState(
    product.variations
      ? product.variations.nodes[0].stockQuantity
      : product.stockQuantity
  )

  const [selectedProductColor, setSelectedProductColor] = useState(
    product?.variations?.nodes?.[0]?.color?.nodes?.[0]?.value ||
      product.paColors.nodes[0]?.name
  )

  const [selectedProductImage, setSelectedProductImage] = useState(
    product.variations
      ? product.variations.nodes[0].image.sourceUrl
      : product.image.sourceUrl
  )

  const [selectedProductColorValue, setSelectedProductColorValue] = useState(
    product.variations
      ? product.variations.nodes[0].color?.nodes[0]?.color
      : product.paColors.nodes[0]?.color
  )

  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variations
      ? product.variations.nodes[0].size?.nodes[0]?.value
      : product.paSizes.nodes[0]?.name
  )

  const cartItem = cartItems.filter(
    (cartItem) => cartItem.selectedProductId === selectedProductId
  )[0]
  const wishlistItem = wishlistItems.filter(
    (wishlistItem) => wishlistItem.id === product.id
  )[0]

  const { normalPrice, salePrice } = getPrice(product)
  const normalPriceFront = getFormat(normalPrice) + ' UZS'
  const salePriceFront = getFormat(salePrice) + ' UZS'

  const [windowWidth, setWindowWidth] = useState()
  let resizeWindow = () => setWindowWidth(window.innerWidth)

  useEffect(() => {
    resizeWindow()
    window.addEventListener('resize', resizeWindow)
    return () => window.removeEventListener('resize', resizeWindow)
  }, [])

  const SliderPrevArrow = (props) => (
    <button
      className='sliderPrevArrow'
      onClick={props.onClick}
      dangerouslySetInnerHTML={{ __html: icons.arrowLeft }}
    />
  )

  const SliderNextArrow = (props) => (
    <button
      className='sliderNextArrow'
      onClick={props.onClick}
      dangerouslySetInnerHTML={{ __html: icons.arrowRight }}
    />
  )

  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <SliderPrevArrow />,
    nextArrow: <SliderNextArrow />,
    dots: true,
  }

  const [scroll, setScroll] = useState(0)
  const [productTop, setProductTop] = useState(0)

  useEffect(() => {
    const addToCartMobile = document.querySelector('#addToCart')
    setProductTop(addToCartMobile.offsetTop)

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = () => {
    setScroll(window.scrollY)
  }

  const [buy, setBuy] = useState(false)
  const [addToCartModal, setAddToCartModal] = useState(false)
  const colorList = []
  const sizeList = []
  if (product.variations) {
    for (const attribute of product.variations.nodes) {
      if (attribute.size?.nodes[0].value === selectedProductSize) {
        colorList.push(
          <button
            style={{
              backgroundColor: attribute.color?.nodes[0].color,
              // backgroundColor: '#000',
            }}
            className={`${s.color} ${
              selectedProductColor === attribute.color?.nodes[0].value
                ? s.active
                : ''
            }`}
            onClick={() => {
              setSelectedProductColor(attribute.color.nodes[0].value)
              setSelectedProductColorValue(attribute.color.nodes[0].color)
              setSelectedProductStock(attribute.stockQuantity)
              setSelectedProductId(attribute.databaseId)
              setSelectedProductImage(attribute.image.sourceUrl)
            }}
          />
        )
      }
      // if (attribute.color.nodes[0].value === selectedProductColor) {

      sizeList.push(
        <button
          key={uuidv4()}
          className={`${s.size} ${
            selectedProductSize === attribute.size?.nodes[0].value
              ? s.active
              : ''
          } ${!attribute.stockQuantity ? s.outOfStock : ''} `}
          onClick={() => {
            setSelectedProductSize(attribute.size.nodes[0].value)
            setSelectedProductStock(attribute.stockQuantity)
            setSelectedProductId(attribute.databaseId)
            setSelectedProductImage(attribute.image.sourceUrl)
          }}
        >
          {attribute.size?.nodes[0].value}
        </button>
      )

      // }
    }
  }

  const data = [
    {
      id: 0,
      name: 'Описание',
      content: (
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      ),
    },
    {
      id: 2,
      name: 'Доставка и возврат',
      content: (
        <div>
          При заказе от 500 000 сум и дополнительного размера, обратная дорога
          оплачивается нами.
          <br />
          <br />
          В случае если сумма заказа менее 500 000 сум и потребуется два размера
          для примерки , дорога туда и обратно оплачивается клиентом. Оплата
          принимается через CLICK ,PAYME и Наличный расчёт.
          <br />
          <br />
          Заказы принимаем с понедельника по субботу с 9:00 до19:00.
          Воскресенье: Выходной.
          <br />
          За отказ или возврат товара оплата за доставку производиться со
          стороны покупателя .
        </div>
      ),
    },
  ]

  const changeSize = (e) => {
    setSelectedProductSize(e.target.value)
    for (const attribute of product.variations.nodes) {
      if (attribute.size.nodes[0].value === selectedProductSize) {
        setSelectedProductStock(attribute.stockQuantity)
        setSelectedProductId(attribute.databaseId)
      }
    }
  }

  const changeColor = (e) => {
    setSelectedProductColor(e.target.value)
    for (const attribute of product.variations.nodes) {
      if (attribute.color.nodes[0].value === selectedProductColor) {
        setSelectedProductStock(attribute.stockQuantity)
        setSelectedProductId(attribute.databaseId)
        setSelectedProductImage(attribute.image.sourceUrl)
      }
    }
  }

  return (
    <>
      <div className='row product_cart'>
        <div className='col-lg-8 col-12'>
          <LightgalleryProvider>
            <div className={s.images}>
              <div className={s.img}>
                <LightgalleryItem
                  src={selectedProductImage}
                  thumb={selectedProductImage}
                >
                  <Image
                    src={selectedProductImage}
                    width={255}
                    height={380}
                    alt='product_main_image'
                  />
                </LightgalleryItem>
              </div>
              {product.galleryImages.nodes.map(({ sourceUrl }) => (
                <div className={s.img} key={sourceUrl}>
                  <LightgalleryItem src={sourceUrl} thumb={sourceUrl}>
                    <Image
                      src={sourceUrl}
                      width={350}
                      height={520}
                      alt='product_extra_images'
                    />
                  </LightgalleryItem>
                </div>
              ))}
            </div>
          </LightgalleryProvider>
          <LightgalleryProvider>
            <Slider {...settings} className={s.slider}>
              <LightgalleryItem
                src={selectedProductImage}
                thumb={selectedProductImage}
              >
                <Image
                  src={selectedProductImage}
                  width={380}
                  height={380}
                  alt='product_slider_main_image'
                />
              </LightgalleryItem>

              {product.galleryImages.nodes.map(({ sourceUrl }) => (
                <LightgalleryItem src={sourceUrl} key={sourceUrl}>
                  <Image
                    src={sourceUrl}
                    width={255}
                    height={380}
                    alt='product_slider_extra_image'
                  />
                </LightgalleryItem>
              ))}
            </Slider>
          </LightgalleryProvider>
          {windowWidth >= 1023 ? (
            <>
              <Tabs data={data} />
              <Offer />
            </>
          ) : null}
        </div>
        <div className='col-lg-4 col-12'>
          <div className={s.details}>
            <div className={s.title}>
              <div className={s.name}>{product.name}</div>
              <button
                className={`${s.addToWishlist} ${
                  wishlistItem ? s.active : null
                }`}
                onClick={
                  wishlistItem
                    ? () => deleteFromWishlist(product)
                    : () => addToWishlist(product)
                }
                dangerouslySetInnerHTML={{ __html: icons.wishlist }}
              />
            </div>
            <div className={s.brand}>
              {product.paBrands.nodes[0]?.name
                ? product.paBrands.nodes[0].name
                : null}
            </div>

            <div className={s.price}>
              {product.onSale ? (
                <>
                  <span className={s.normalPrice}>{normalPriceFront}</span>
                  <span className={s.salePrice}>{salePriceFront}</span>
                </>
              ) : (
                <span>{normalPriceFront}</span>
              )}
            </div>
          </div>
          {selectedProductColor && (
            <>
              <div className={s.attributesName}>Цвет:</div>
              <div className={s.topColor}>
                {topColors.length !== 0 &&
                  topColors.map(({ slug, image }) => (
                    // eslint-disable-next-line react/jsx-key
                    <Link href={`/product/${slug}`}>
                      <a
                        style={{ backgroundImage: `url(${image.sourceUrl})` }}
                        className={product.slug == slug && s.active}
                      ></a>
                    </Link>
                  ))}
              </div>
            </>
          )}

          {/* {selectedProductColor && (
            <>
              <div className={s.attributesName}>Цвет1: </div>
              <div className={s.colorList}>
                <button
                  className={`${s.color} ${s.active}`}
                  style={{
                    background: product.paColors.nodes[0].color,
                  }}></button>
              </div>
            </>
          )} */}

          {product.variations ? (
            <>
              {/* {selectedProductColor && (
                <>
                  <div className={s.attributesName}>Цвет</div>
                  <div className={s.colorList}>{colorList}</div>
                </>
              )} */}
              {selectedProductSize && (
                <>
                  <div className={s.attributesName}>Размер</div>
                  <div className={s.sizeList}>{sizeList}</div>
                </>
              )}
            </>
          ) : (
            <>
              {/*{selectedProductColor && (*/}
              {/*    <>*/}
              {/*      <div className={s.attributesName}>Цвет:</div>*/}
              {/*      <div className={s.topColor}>*/}
              {/*        {topColors.length !== 0 &&*/}
              {/*        topColors.map(({slug, image}) => (*/}
              {/*            // eslint-disable-next-line react/jsx-key*/}
              {/*            <Link href={`/product/${slug}`}>*/}
              {/*              <a*/}
              {/*                  style={{backgroundImage: `url(${image.sourceUrl})`}}*/}
              {/*                  className={product.slug == slug && s.active}*/}
              {/*              ></a>*/}
              {/*            </Link>*/}
              {/*        ))}*/}
              {/*      </div>*/}
              {/*    </>*/}
              {/*)}*/}
              {selectedProductSize && (
                <>
                  <div className={s.attributesName}>Размер</div>
                  <div className={s.sizeList}>
                    <button key={uuidv4()} className={`${s.size} ${s.active}`}>
                      {selectedProductSize}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          <button
            id='addToCart'
            className={`${s.cart} ${cartItem ? s.active : ''}  `}
            onClick={
              cartItem
                ? () => deleteFromCart(selectedProductId)
                : () => {
                    addToCart(
                      product,
                      selectedProductColor,
                      selectedProductSize,
                      selectedProductId
                    ),
                      setAddToCartModal(true)
                    getActiveStatus(true)
                  }
            }
            disabled={!selectedProductStock}
          >
            {cartItem ? 'Добавлен в корзину' : 'Добавить в корзину'}
          </button>
          <AddToCartModal
            addToCart={addToCartModal}
            setAddToCart={setAddToCartModal}
            selectedProductSize={selectedProductSize}
            selectedProductColor={selectedProductColor}
            selectedProductColorValue={selectedProductColorValue}
            image={selectedProductImage}
            title={product.name}
          />
          <button className={s.OneClick} onClick={() => setBuy(!buy)}>
            Заказать сейчас
          </button>

          <InstantBuyModal
            buy={buy}
            setBuy={setBuy}
            product={product}
            selectedProductId={selectedProductId}
            selectedProductColor={selectedProductColor}
            selectedProductSize={selectedProductSize}
            selectedProductStock={selectedProductStock}
            normalPriceFront={normalPriceFront}
            salePriceFront={salePriceFront}
            normalPrice={normalPrice}
            salePrice={salePrice}
            changeSize={changeSize}
            changeColor={changeColor}
            colorList={colorList}
            sizeList={sizeList}
          />
          {/* <button
          className={s.stockStatus}
          onClick={() => setStockStatus(!stockStatus)}
        >
          Наличие в магазинах
        </button> */}
          <div className={s.info}>
            <div className={s.content}>
              <div className={s.title}>Доставка товара</div>
              Доставка по городу Ташкент осуществляется через Яндекс GO( такси)
              в течение 48 часов от нашего склада до вашего дома по тарифному
              плану.
            </div>
            <div className={s.content}>
              <div className={s.title}>
                Доставка по Регионам Узбекистана в течение 2-5 дней.
              </div>
            </div>
          </div>
          {windowWidth <= 1023 ? (
            <>
              <div className={s.mobileProductDetails}>
                <Accordion title='Описание' active={true}>
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </Accordion>
                <Accordion title='Состав' active={true}>
                  {product.paMaterials?.nodes[0]?.name ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.paMaterials.nodes[0].name,
                      }}
                    />
                  ) : null}
                </Accordion>
                <Accordion title='Доставка и возврат' active={false}>
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </Accordion>
              </div>
              <Offer />
            </>
          ) : null}
        </div>
        <div className='col-lg-12 col-12'>
          <ProductSlider
            title='Возможно вам понравится'
            products={product.related.nodes}
          />
        </div>
      </div>
    </>
  )
}
export default ProductCard

// {selectedProductColor && (
//   <>
//     <div className={s.attributesName}>Цвет5: </div>
//     <div className={s.topColor}>
//      {topColors.length != 0 && (
//       topColors.map(({ slug, image }) => (
//       <Link href={'/product/' + slug}>
//         <a style={{ backgroundImage: `url(${image.sourceUrl})` }} className={product.slug == slug && s.active}></a>*/}
//      </Link>
//      ))
//      )}
//     </div>
//   </>
// )}
