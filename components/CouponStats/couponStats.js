import s from "./couponStats.module.scss";
import React, { useState } from 'react'
import axios from 'axios'

const CouponStats = ({ accountLevel, setAccountLevel, points, setPoints, referalCode, referredCount }) => {
  const [couponLoading, setCouponLoading] = useState(false)
  const [plusLoading, setPlusLoading] = useState(false)
  const [referalShow, setReferalShow] = useState(false)

  const convertPoints = async () => {
    setCouponLoading(true);
    const response = await axios.post("/api/user/convertPoints", { type: 'coupon' });
    const data = response.data
    if ( data.status ){
      setPoints(data.data.totalPoints)
    }
    setCouponLoading(false);
  }

  const buyPlus = async () => {
    setPlusLoading(true);
    const response = await axios.post("/api/user/convertPoints", { type: 'subscription' });
    const data = response.data
    if ( data.status ){
      setPoints(data.data.totalPoints)
      setAccountLevel(data.data.level)
    }
    setPlusLoading(false);
  }

  return (
    <div className={s.c}>
      <ul>
        <li>
          <label>Текущий баланс</label>
          <span>{points} баллов</span>
        </li>
        <li>
          <label>Приглашенных друзей</label>
          <span>{referredCount}</span>
        </li>
      </ul>
      <button className={s.b} disabled={points < 500 || accountLevel === 1} onClick={() => {buyPlus()}}>Активировать Plus {plusLoading && <span className={s.loader} />}</button>
      <button className={s.b2} disabled={points < 200 || couponLoading} onClick={() => {convertPoints()}}>Обменять на купон {couponLoading && <span className={s.loader} />}</button>
      <button className={s.b2} onClick={() => {navigator.clipboard.writeText(`https://thems.uz/account/?ref=${referalCode}`); setReferalShow(true)}}>Пригласить друга</button>
      {referalShow && <span className={s.refShow}>Ссылка скопирована</span>}
    </div>
  )
}
export default CouponStats;
