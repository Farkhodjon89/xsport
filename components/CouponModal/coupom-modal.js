import React from 'react';
import s from './coupon-modal.module.scss';
import ReactModal from 'react-modal';
import { useState } from 'react';
import axios from 'axios';
import icons from '../../public/fixture';
import MaskedInput from 'react-input-mask';
import { useForm } from 'react-hook-form';
import ReactTooltip from 'react-tooltip';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loader from '../Loader';

const CouponModal = ({
  activeCoupon,
  setActiveCoupon,
  sendCoupon,
  error,
  setName,
  name,
  myCoupon,
  setActive,
  loading,
}) => {
  let using = ' использование';

  if (myCoupon) {
    if (myCoupon.usageLimitPerUser > 1 && myCoupon.usageLimitPerUser < 5) {
      using = ' использования';
    } else if (myCoupon.usageLimitPerUser > 4) {
      using = ' использований';
    }
  }

  return (
    <>
      <ReactModal
        isOpen={activeCoupon}
        onRequestClose={() => setActiveCoupon(false)}
        ariaHideApp={false}
        overlayClassName={s.modalOverlay}
        className={s.modalContent}>
        {myCoupon ? (
          <div className={s.modal}>
            {loading ? (
              <Loader coupon />
            ) : (
              <>
                <div className={s.title}>Купон активирован</div>
                <ul className={s.list}>
                  <li className={s.item}>
                    <div className={s.name}>Код купона</div>
                    <div className={s.value}>{myCoupon.code}</div>
                  </li>
                  <li className={s.item}>
                    <div className={s.name}>Сумма купона</div>
                    <div className={s.value}>
                      {myCoupon.amount + (myCoupon.discountType == 'PERCENT' ? ' %' : ' UZS')}
                    </div>
                  </li>
                  <li className={s.item}>
                    <div className={s.name}>Срок действия</div>
                    <div className={s.value}>{myCoupon.usageLimitPerUser + using}</div>
                  </li>
                </ul>
                <button
                  className={s.blueButton}
                  onClick={() => {
                    setActiveCoupon(false);
                    setActive(true);
                  }}>
                  Перейти к покупкам
                </button>
                <button
                  onClick={() => {
                    setActiveCoupon(false);
                    setActive(true);
                  }}
                  className={s.close}
                  dangerouslySetInnerHTML={{ __html: icons.times }}
                />
              </>
            )}
          </div>
        ) : (
          <div className={s.modal}>
            {loading ? (
              <Loader coupon />
            ) : (
              <>
                <div className={s.title}>Активация купона</div>
                <div className={s.sendPromoCode}>
                  <div className={s.inputs}>
                    <input
                      id="cupon"
                      name="cupon"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={name ? s.valid : ''}
                    />
                    <label htmlFor="cupon">Введите промокод</label>
                    {error && <div className={s.errorMessage}>Неправильный промокод</div>}
                  </div>
                  <button className={s.blueButton} onClick={sendCoupon}>
                    Активировать
                  </button>
                </div>
                <button
                  onClick={() => setActiveCoupon(false)}
                  className={s.close}
                  dangerouslySetInnerHTML={{ __html: icons.times }}
                />
              </>
            )}
          </div>
        )}
      </ReactModal>
    </>
  );
};

export default CouponModal;
