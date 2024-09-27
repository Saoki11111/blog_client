import {useRouter} from "next/router";
import React, { useState} from "react";
import styles from "../../../styles/EditPost.module.css";
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

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}

const EditPost = ({ post }: Props) => {
  const router = useRouter();
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [isSaving, setIsSaving] = useState(false);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // 更新処理
  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push(`/posts/${post.id}`); // 更新後 リダイレクト
      } else {
        console.error("更新しました");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Editing Post: {post.title}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="styles.input"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="styles.textarea"
          />
        </div>
        
        <button type="submit" disabled={isSaving} className={styles.saveButton}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
