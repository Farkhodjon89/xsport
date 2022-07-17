import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import redirect from "nextjs-redirect";
import { StaticDataSingleton } from "../../utils/staticData";
import useUser from "../../utils/useUser";
import AccountNav from "../../components/AccountNav";
import Breadcrumbs from "../../components/Breadcrumbs";
import AccountOrder from "../../components/AccountOrder";
import AccountHeading from "../../components/AccountHeading";

const Account = ({ categories }) => {
  useUser({redirectTo: "/account"});
  const { userData } = useUser();
  const path = [
    {
      name: "Главная",
      link: "/",
    },
    {
      name: "Аккаунт",
      link: `/account/order`,
    },
    {
      name: "Мои заказы",
      link: ``,
    },
  ];
  if (!userData?.isLoggedIn) {
    return null
  }
  return (
    <Layout categories={categories}>
      <div className="container">
        <Breadcrumbs path={path} />
        <AccountHeading firstName={userData ? userData.user.firstName : null} /> 
        <div className="row">
          <div className="col-lg-3 col-md-12">
            <AccountNav />
          </div>
          <div className="col-lg-8 offset-lg-1">
            <AccountOrder />
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
