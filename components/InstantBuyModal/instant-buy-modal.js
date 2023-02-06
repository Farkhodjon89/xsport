import React from 'react'
import s from './instant-buy-modal.module.scss'
import ReactModal from 'react-modal'
import { useState } from 'react'
import axios from 'axios'
import icons from '../../public/fixture'
import MaskedInput from 'react-input-mask'
import { useForm } from 'react-hook-form'
// import ReactTooltip from "react-tooltip";
import { useRouter } from 'next/router'
import { getFormat } from '../../utils'
// import Link from "next/link";
import Image from 'next/image'

const InstantBuyModal = ({
  buy,
  setBuy,
  product,
  selectedProductId,
  selectedProductColor,
  selectedProductSize,
  selectedProductStock,
  normalPriceFront,
  salePriceFront,
  normalPrice,
  salePrice,
  changeSize,
  changeColor,
}) => {
  const { register, handleSubmit, errors } = useForm()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+998 ')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [thank, setThank] = useState(false)
  const [orderID, setOrderID] = useState('')
  const orderPrice = product.onSale ? salePrice : normalPrice
  const orderPriceTotal = [getFormat(orderPrice), 'UZS'].join(' ')
  const discountAmount = [getFormat(normalPrice - salePrice), 'UZS'].join(' ')
  const sendInfo = async () => {
    setIsLoading(true)

    const orderData = {
      set_paid: false,
      currency: 'UZS',
      status: 'processing',
      payment_method_title: 'cash',
      line_items: [
        {
          product_id: product.databaseId,
          name: product.name,
          price: product.onSale ? salePrice : normalPrice,
          quantity: product.quantity,
          variation_id: product.variations && selectedProductId,
        },
      ],
      billing: {
        first_name: name,
        phone: phone,
      },
    }

    const response = await axios.post('/api/order', { order: orderData })

    if (response.data.status) {
      setBuy(false)
      setOrderID(response.data.order.id)
      setThank(true)
    } else {
      alert(response.data.message)
      router.reload()
    }

    setIsLoading(false)
  }

  const colorList = []
  const sizeList = []
  if (product.variations) {
    let color = ''
    let size = ''
    for (const attribute of product.variations.nodes) {
      if (size !== attribute.size.nodes[0].value) {
        sizeList.push(<option>{attribute.size.nodes[0].value}</option>)
        size = attribute.size.nodes[0].value
      }
      if (color !== attribute.color.nodes[0].value) {
        colorList.push(<option>{attribute.color.nodes[0].value}</option>)
        color = attribute.color.nodes[0].value
      }
    }
  }
  return (
    <>
      <ReactModal
        isOpen={buy}
        onRequestClose={() => setBuy(false)}
        ariaHideApp={false}
        overlayClassName={s.modalOverlay}
        className={s.modalContent}
      >
        <div className={s.modalTop}>
          <div>Купить сейчас</div>
          <button
            className={s.close}
            dangerouslySetInnerHTML={{ __html: icons.times }}
            onClick={() => setBuy(false)}
          />
        </div>
        <div className={s.product}>
          <div className={s.image}>
            <Image
              src={product.image ? product.image.sourceUrl : null}
              alt='instant_buy_modal_img'
              width={120}
              height={176}
            />
          </div>
          <div className={s.details}>
            <div className={s.name}>{product.name}</div>
            <div className={s.brand}>
              {product.paBrands.nodes[0]?.name
                ? product.paBrands.nodes[0].name
                : null}
            </div>
            <div className={s.price}>
              {product.onSale ? (
                <>
                  <span className={s.normalPrice}>{normalPriceFront}</span>
                  <span className={s.salePrice}> {salePriceFront} </span>
                </>
              ) : (
                <span>{normalPriceFront}</span>
              )}
            </div>

            <div className={s.attribute}>
              {product.variations ? (
                <>
                  <div className={s.color}>
                    Цвет
                    <div className='palette'></div>
                    {/*<select*/}
                    {/*  value={selectedProductColor}*/}
                    {/*  name="Выберите цвет"*/}
                    {/*  onChange={changeColor}>*/}
                    {/*  {colorList}*/}
                    {/*</select>*/}
                    {product?.paColors?.nodes[0]?.name}
                  </div>

                  <div className={s.size}>
                    Размер
                    <select
                      value={selectedProductSize}
                      name='Выберите размер'
                      onChange={changeSize}
                    >
                      {sizeList}
                    </select>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className={s.inputs}>
          <input
            id='name'
            name='name'
            onChange={(e) => setName(e.target.value)}
            ref={register({ required: true })}
            className={`${errors.name && s.error} ${name ? s.valid : ''}`}
          />
          <label htmlFor='name'>Имя</label>
          {errors.name ? (
            <p className={s.errorMessage}>Необходимо заполнить</p>
          ) : null}
        </div>
        <div className={s.inputs}>
          <MaskedInput
            id='phone'
            mask='+\9\98 (99) 999 99 99'
            alwaysShowMask
            className={errors.phone && s.error}
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            name='phone'
          >
            {(inputProps) => (
              <input
                ref={register({
                  required: true,
                  pattern:
                    /^[\+]?[0-9]{3}?[-\s\.]?[(]?[0-9]{2}?[)][-\s\.]?[0-9]{3}?[-\s\.]?[0-9]{2}?[-\s\.]?[0-9]{2}$/im,
                })}
                value={phone}
                name={inputProps.name}
                {...inputProps}
              />
            )}
          </MaskedInput>
          {errors.phone ? (
            <p className={s.errorMessage}>Необходимо заполнить</p>
          ) : null}
        </div>
        <div className={s.totalPirce}>
          Сумма к оплате
          <span className={s.price}>
            {salePrice ? salePriceFront : normalPriceFront}
          </span>
        </div>
        <button
          className={s.submit}
          disabled={!selectedProductStock || isLoading}
          onClick={handleSubmit(sendInfo)}
        >
          {isLoading ? (
            <div className={s.loaderAnimation}></div>
          ) : (
            <>{!selectedProductStock ? 'Нет в наличии' : 'Купить сейчас'}</>
          )}
        </button>
      </ReactModal>
      {thank ? (
        <ReactModal
          isOpen={thank}
          onRequestClose={() => setThank(false)}
          ariaHideApp={false}
          overlayClassName={s.modalOverlay}
          className={s.modalContent}
        >
          <section className={s.wrapper}>
            <div className={s.heading}>
              <h2 className={s.title}>Спасибо за покупку</h2>
            </div>
            <div className={s.clientData}>
              <h2 className={s.title}>Данные заказа</h2>
              <ul className={s.list}>
                <li className={s.item}>
                  <p>Имя</p> <span>{name}</span>
                </li>
                <li className={s.item}>
                  <p>Номер телефона</p> <span>{phone}</span>
                </li>
                <li className={s.item}>
                  <p>Номер заказа</p> <span>{orderID}</span>
                </li>
              </ul>
            </div>
            <div className={s.orderReview}>
              <h2 className={s.title}>Сумма к оплате</h2>
              <ul className={s.list}>
                <li className={s.item}>
                  <p>Подытог</p> <span>{normalPriceFront}</span>
                </li>
                <li className={s.item}>
                  <p>Ваши скидки</p>{' '}
                  <span className='disAmount'>
                    {'- '}
                    {salePriceFront}
                  </span>
                </li>
                <li className={s.item}>
                  <p>Доставка</p> <span>10 500 UZS</span>
                </li>
                <li className={s.item}>
                  <p>Итого</p> <span>{`${orderPrice + 10500} UZS`}</span>
                </li>
              </ul>
            </div>
            {/* <OrderReview /> */}
            <button className={s.button} onClick={() => setThank(false)}>
              Ок
            </button>
          </section>
        </ReactModal>
      ) : null}
    </>
  )
}

export default InstantBuyModal
