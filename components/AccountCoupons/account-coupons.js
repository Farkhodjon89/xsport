import s from "./account-coupons.module.scss";
import AccountOrder from '../AccountOrder'
import { useState } from 'react'
import AccountCouponList from '../AccountCouponList'

const AccountCoupons = ({ coupons }) => {
  const [activeTab, setActiveTab] = useState('history')
  return (
    <div className={s.c}>
      <ul className={s.tabs}>
        <li>
          <button onClick={() => {setActiveTab('history')}} className={activeTab === 'history' ? s.active : ''}>История</button>
        </li>
        <li>
          <button onClick={() => {setActiveTab('coupons')}} className={activeTab === 'coupons' ? s.active : ''}>Купоны</button>
        </li>
      </ul>
      {activeTab === 'history' && <AccountOrder coupons/>}
      {activeTab === 'coupons' && <AccountCouponList coupons={coupons} />}
    </div>
  );
};
export default AccountCoupons;
