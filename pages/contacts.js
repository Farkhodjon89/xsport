import Layout from '../components/Layout'
import { StaticDataSingleton } from '../utils/staticData'
import CONTACTS from '../queries/contacts'
import client from '../apollo/apollo-client'
import Contacts from '../components/Contacts/contacts'
import SectionTitle from '../components/SectionTitle'
import Breadcrumbs from '../components/Breadcrumbs'
import { HeadData } from '../components/Head'

const ContactsPage = ({ categories, contacts }) => {
  const path = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Контакты/Магазины',
      link: '/contacts',
    },
  ]
  return (
    <>
      <HeadData title={'Контакты'} pageUrl='/contancts' />
      <Layout categories={categories}>
        <div className='container'>
          <Breadcrumbs path={path} />
          <SectionTitle title='Контакты/Магазины' />
          <Contacts contacts={contacts} />
        </div>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch(true)

  const categories = staticData.getRootCategories()

  //console.log('categories l45:', categories);

  const contacts = await client.query({
    query: CONTACTS,
  })

  return {
    props: {
      contacts:
        contacts.data.themeGeneralSettings.globalOptions.contacts || null,
      categories: categories.allCategories || null,
    },
  }
}

export default ContactsPage
