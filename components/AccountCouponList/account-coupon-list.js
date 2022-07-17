import s from './account-coupon-list.module.scss';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader';
import icons from '../../public/fixture';

const AccountCouponList = ({ coupons }) => {
  const [couponsList, setCoupons] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setCoupons(coupons);
  }, coupons);

  if (loader) {
    return <Loader />;
  }

  const convertPoints = async () => {
    setLoader(true);
    const response = await axios.post('/api/user/convertPoints', { type: 'coupon' });
    const data = response.data;
    if (data.status) {
      setCoupons([
        ...couponsList,
        {
          code: data.data.couponCode,
          amount: data.data.couponAmount,
        },
      ]);
    }
    setLoader(false);
  };

  if (couponsList.length > 0) {
    return (
      <ul className={s.c}>
        {couponsList.map(({ code, amount }, id) => (
          <li key={id}>
            <ul className={s.a}>
              <li>
                <label>Код купона</label>
                <span>{code}</span>
              </li>
              <li>
                <label>Сумма купона</label>
                <span>{amount} UZS</span>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                  }}>
                  <i dangerouslySetInnerHTML={{ __html: icons.copy }} />
                  Копировать
                </button>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <div className={s.emptyCoupons}>
        <div className={s.i}>
          <i dangerouslySetInnerHTML={{ __html: icons.info }} />
          <p>
            У вас нет активных <strong>Купонов</strong>
          </p>
        </div>
        <button
          onClick={() => {
            convertPoints();
          }}>
          Обменять баллы
        </button>
      </div>
    );
  }
};
export default AccountCouponList;
