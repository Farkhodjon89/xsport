import client from '../../apollo/apollo-client'
import { POST_BY_SLUG, DATA_FOR_POSTS } from '../../queries/posts'
import Breadcrumbs from '../../components/Breadcrumbs'
import { StaticDataSingleton } from '../../utils/staticData'
import Layout from '../../components/Layout'
import Banner from '../../components/Banner'
import { formatPost } from '../../utils'

const Post = ({ post, categories }) => {
  const breadcrumbs = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Блог',
      link: `/blog`,
    },
    {
      name: post.title,
      link: `/blog${post.slug}`,
    },
  ]

  return (
    <Layout categories={categories}>
      <div className='container'>
        <Breadcrumbs path={breadcrumbs} />
        {/*<Banner*/}
        {/*  image={post.featuredImage.node?.sourceUrl}*/}
        {/*  title={post.title}*/}
        {/*  subtitle={post.excerpt}*/}
        {/*  url={`/blog/${post.slug}`}*/}
        {/*  blog={true}*/}
        {/*/>*/}

        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </Layout>
  )
}

export const getStaticPaths = async () => {
  const result = await client.query({
    query: DATA_FOR_POSTS,
    fetchPolicy: 'no-cache',
  })

  const posts = result.data.posts.nodes.map((post) => formatPost(post, true))
  const paths = [...posts.map((post) => ({ params: { slug: post.slug } }))]

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  let result

  const staticData = new StaticDataSingleton()
  await staticData.checkAndFetch()

  const categories = staticData.getRootCategories()

  try {
    result = await client.query({
      query: POST_BY_SLUG,
      variables: {
        slug: params.slug,
      },
      fetchPolicy: 'no-cache',
    })
  } catch (e) {
    return {
      props: {
        notFound: true,
      },
      revalidate: 600,
    }
  }

  const post = {
    ...result.data.post,
    date: new Date(result.data.post.date)
      .toLocaleDateString()
      .split('-')
      .reverse()
      .join('.'),
    content: result.data.post.content.replace(/^\n|\n$/g, ''),
  }

  return {
    props: {
      post,
      categories: categories.allCategories || null,
      notFound: false,
    },
    revalidate: 600,
  }
}

export default Post
