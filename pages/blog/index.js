import Layout from "../../components/Layout";
import { POSTS, DATA_FOR_POSTS } from "../../queries/posts";
import client from "../../apollo/apollo-client";
import { useLazyQuery } from "@apollo/react-hooks";
import { formatPost } from "../../utils";
import { useState, useEffect } from "react";
import { StaticDataSingleton } from "../../utils/staticData";
import Banner from "../../components/Banner";
import Breadcrumbs from "../../components/Breadcrumbs"
const Index = ({ posts, pageInfo, categories }) => {
  const [loadPosts, { data }] = useLazyQuery(POSTS, {
    client,
  });

  const [currentPosts, setCurrentPosts] = useState(posts);
  const [currentPageInfo, setCurrentPageInfo] = useState(pageInfo);

  useEffect(() => {
    setCurrentPosts(posts);
  }, [posts]);

  useEffect(() => {
    if (data) {
      setCurrentPageInfo(data.posts.pageInfo);
      setCurrentPosts([...currentPosts, data.posts.nodes]);
    }
  }, [data]);

  const loadMore = () => {
    if (currentPageInfo.hasNextPage) {
      loadPosts({
        variables: {
          first: 10,
          after: currentPageInfo.endCursor,
        },
      });
    }
  };

  const postList = [];

  for (const post of posts) {
    postList.push(
      // <Banner
      //   image={post.featuredImage?.node.sourceUrl}
      //   title={post.title}
      //   subtitle={post.excerpt}
      //   buttonTitle="Читать дальше"
      //   url={`/blog/${post.slug}`}
      //   blog={true}
      // />
    );
  }

  const breadcrumbs = [
    {
      name: "Главная",
      link: "/",
    },
    {
      name: "Блог",
      link: `/blog`,
    },
  ];

  return (
    <Layout categories={categories}>
      
      <div className="container">
      <Breadcrumbs path={breadcrumbs} />
        {postList}
        </div>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const staticData = new StaticDataSingleton();
  await staticData.checkAndFetch();

  const categories = staticData.getRootCategories();

  const result = await client.query({
    query: DATA_FOR_POSTS,
    fetchPolicy: "no-cache",
  });

  const posts = result.data.posts.nodes.map((post) => formatPost(post, true));

  return {
    props: {
      posts,
      pageInfo: result.data.posts.pageInfo,
      categories: categories.allCategories,
    },
    // revalidate: 600,
  };
};

export default Index;
