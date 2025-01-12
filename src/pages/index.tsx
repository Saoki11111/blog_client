import Head from "next/head";
import { Post } from "@/types";
import Link from "next/link";
import styles from '@/styles/Index.module.css'
type Props = {
  posts: Post[];
};


export async function getStaticProps(){
  const res = await fetch("http://localhost:3001/api/v1/posts");
  const posts = await res.json();

  console.log(posts);

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60 * 24,
  };
}

export default function Home( {posts}: Props ) {
  return (
  <>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div>
      {posts.map((post: Post) => (
        <div key={post.id} className={styles.postCard}>
          <Link href={`posts/${post.id}`} className={styles.postCardBox}>
           <h2>{post.title}</h2> 
          </Link>
          <p>{post.content}</p>
          <button className={styles.editButton}>Edit</button>
          <button className={styles.delete}>Delete</button>
        </div>
      ))}
    </div>
  </>
  );
}
