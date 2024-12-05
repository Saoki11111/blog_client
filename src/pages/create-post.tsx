import React, {ChangeEvent, FormEvent, useState} from "react";
import styles from "../styles/Home.module.css"
import {useRouter} from "next/router";

const CreatePost = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await fetch("http://localhost:3001/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
  
      if (res.ok) {
        // 投稿が成功した場合の処理
        console.log("Post created successfully!");
        // 必要に応じてリダイレクトなどを行う
        router.push("/");
      } else {
        console.error("Error creating post:", res.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ブログ新規登録</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>タイトル</label>
        <input
          type="text"
          className={styles.input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
        <label className={styles.label}>本文</label>
        <textarea
          className={styles.textarea}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
        />
        <button type="submit" className={styles.button}>投稿</button>
      </form>
    </div>
  );
};

export default CreatePost;
