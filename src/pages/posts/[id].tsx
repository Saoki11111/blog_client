import {useRouter} from "next/router";
import React from "react";
import styles from "../../styles/Post.module.css";
import type { Post } from "@/types";

type Props = {
  post: Post;
};

// pages/posts/[id].tsx
export async function getStaticPaths() {
  const res = await fetch("http://localhost:3001/api/v1/posts");
  const posts: Post[] = await res.json();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({params}: { params: {id: string} }){
  const res = await fetch(`http://localhost:3001/api/v1/posts/${params.id}`);
  const post = await res.json();

  console.log(post);

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}

const Post = ({ post }: Props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{post.title}</div>
      <div className={styles.date}>{post.created_at}</div>
      <p className={styles.content}>{post.content}</p>

      <button onClick={() => router.push('/')} className={styles.backButton}>
        トップページに戻る
      </button>
    </div>
  )
};

export default Post
