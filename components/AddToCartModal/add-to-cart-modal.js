import React from 'react';
import s from './add-to-cart-modal.module.scss';
import ReactModal from 'react-modal';
// import { useState } from 'react';
// import axios from 'axios';
import icons from '../../public/fixture';
// import MaskedInput from 'react-input-mask';
// import { useForm } from 'react-hook-form';
// import ReactTooltip from 'react-tooltip';
// import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const AddToCartModal = ({
  addToCart,
  setAddToCart,
  selectedProductColor,
  selectedProductColorValue,
  selectedProductSize,
  image,
  title,
}) => {
  return (
    <>
      <ReactModal
        isOpen={addToCart}
        onRequestClose={() => setAddToCart(false)}
        ariaHideApp={false}
        overlayClassName={s.modalOverlay}
        className={s.modalContent}>
        <div className={s.modal}>
          <div className={s.image}>
            <Image src={image} width={119} height={176} alt="add_to_cart_moadal_image" />
          </div>
          <div className={s.content}>
            <div className={s.title}>{title}</div>
            <div className={s.attributes}>
              <div className={s.color}>
                Цвет:{' '}
                <span style={{ background: selectedProductColorValue }}>
                  {/* {selectedProductColor} */}
                </span>
              </div>
              <div className={s.size}>
                Размер: <span>{selectedProductSize}</span>
              </div>
            </div>
            <div className={s.text}>
              <span className={s.icon} dangerouslySetInnerHTML={{ __html: icons.cheker }} />
              Добавлен в вашу корзину
            </div>
            <div className={s.buttons}>
              <button className={s.toShop} onClick={() => setAddToCart(false)}>
                Продолжить покупки
              </button>
              <Link href="/cart">
                <a className={s.toCart}>В корзину</a>
              </Link>
            </div>
            <button
              onClick={() => setAddToCart(false)}
              className={s.close}
              dangerouslySetInnerHTML={{ __html: icons.times }}
            />
          </div>
        </div>
        <div className={s.mobileButtons}>
          <button className={s.toShop} onClick={() => setAddToCart(false)}>
            Продолжить покупки
          </button>
          <Link href="/cart">
            <a className={s.toCart}>В корзину</a>
          </Link>
        </div>
      </ReactModal>
    </>
  );
};

export default AddToCartModal;
