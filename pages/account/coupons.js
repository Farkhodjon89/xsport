import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { StaticDataSingleton } from '../../utils/staticData';
import useUser from '../../utils/useUser';
import AccountNav from '../../components/AccountNav';
import Breadcrumbs from '../../components/Breadcrumbs';
import AccountHeading from '../../components/AccountHeading';
import CouponStats from '../../components/CouponStats';
import AccountCoupons from '../../components/AccountCoupons';

const Account = ({ categories }) => {
  const { userData } = useUser({ redirectTo: '/account' });
  const [points, setPoints] = useState(0);
  const [accountLevel, setAccountLevel] = useState(0);

  let user = userData?.isLoggedIn ? userData.user : {};

  useEffect(() => {
    setPoints(userData.user.totalPoints);
    setAccountLevel(userData.user.level);
  }, [user, userData?.isLoggedIn]);

  const path = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Аккаунт',
      link: `/account/orders`,
    },
    {
      name: 'Купоны',
      link: ``,
    },
  ];

  if (!userData?.isLoggedIn) {
    return null;
  }
  return (
    <Layout categories={categories}>
      <div className="container">
        <Breadcrumbs path={path} />
        <AccountHeading
          level={accountLevel}
          firstName={userData ? userData.user.firstName : null}
        />
        <div className="row">
          <div className="col-lg-3">
            <AccountNav />
            <CouponStats
              accountLevel={accountLevel}
              setAccountLevel={setAccountLevel}
              points={points}
              referredCount={userData.user.referredCount}
              setPoints={setPoints}
              referalCode={userData.user.referralCode}
            />
          </div>
          <div className="col-lg-8 offset-lg-1">
            <AccountCoupons coupons={userData.user.coupons} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  const staticData = new StaticDataSingleton();
  await staticData.checkAndFetch();

  const categories = staticData.getRootCategories();

  return {
    props: {
      categories: categories.allCategories,
    },
    revalidate: 60,
  };
}

export default Account;
