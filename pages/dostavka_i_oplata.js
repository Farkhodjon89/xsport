import Layout from '../components/Layout';
import client from '../apollo/apollo-client';
import { GETPAGEBYSLUG } from '../queries/pages';
import { StaticDataSingleton } from '../utils/staticData';
import Breadcrumbs from '../components/Breadcrumbs';
import PageInfo from '../components/PageInfo/page-info';
import { HeadData } from '../components/Head';

const Delivery = ({ categories, pageContent }) => {
  const path = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Доставка и оплата',
      link: '/dostavka_i_oplata',
    },
  ];
  return (
    <>
      <HeadData title={'Доставка и оплата'} pageUrl="/dostavka_i_oplata" />
      <Layout categories={categories}>
        <div className="container">
          <Breadcrumbs path={path} />
          <PageInfo pageContent={pageContent} />
        </div>
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  const staticData = new StaticDataSingleton();
  await staticData.checkAndFetch(false);
  const categories = staticData.getRootCategories();

  const page = await client.query({
    query: GETPAGEBYSLUG,
    variables: {
      id: 'https://xsportwp.billz.work/dostavka_i_oplata',
    },
  });

  return {
    props: {
      categories: categories.allCategories,
      pageContent: page.data.page,
    },
    revalidate: 60,
  };
}

export default Delivery;
