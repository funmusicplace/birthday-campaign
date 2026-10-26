"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import api from "./api";

const ARTIST_ID = process.env.NEXT_PUBLIC_ARTIST_ID || "4";

interface Post {
  id: number;
  title: string;
  content?: string;
  publishedAt: string;
  featuredImage?: {
    src?: string;
  } | null;
}

function getTextPreview(html: string, maxLength = 140): string {
  const spacedHtml = html.replace(
    /<\/(p|div|h[1-6]|li|blockquote)>|<br\s*\/?>/gi,
    " ",
  );
  const doc = new DOMParser().parseFromString(spacedHtml, "text/html");
  const text = (doc.body.textContent || "").replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function PostCard({ artistSlug, post }: { artistSlug: string; post: Post }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const downTimeRef = useRef<number>(0);

  return (
    <li
      className="group flex flex-col bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-[0_0_0_0.25rem] focus-within:shadow-[0_0_0_0.25rem]"
      onMouseDown={() => {
        downTimeRef.current = Date.now();
      }}
      onMouseUp={(event) => {
        const upTime = Date.now();
        if (
          upTime - downTimeRef.current < 200 &&
          linkRef.current &&
          event.target !== linkRef.current &&
          !linkRef.current.contains(event.target as Node)
        ) {
          linkRef.current.click();
        }
      }}
    >
      <div className="order-1 flex flex-col grow p-4 gap-3 max-w-[60ch]">
        <h3>
          <a
            className="focus:underline group-focus-within:focus:no-underline focus:outline-none"
            href={`https://mirlo.space/${artistSlug}/posts/${post.id}`}
            ref={linkRef}
            target="_blank"
          >
            {post.title}
          </a>
        </h3>
        {post.content && <p>{getTextPreview(post.content)}</p>}
      </div>
      {post.featuredImage?.src && (
        <div className="relative h-32">
          <Image
            alt=""
            className="object-cover"
            fill
            src={post.featuredImage.src}
            unoptimized
          />
        </div>
      )}
    </li>
  );
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [artistSlug, setArtistSlug] = useState<string>(ARTIST_ID);

  useEffect(() => {
    api
      .get<{ posts: Post[]; urlSlug?: string }>(`artists/${ARTIST_ID}`)
      .then((response) => {
        if (response.result.urlSlug) {
          setArtistSlug(response.result.urlSlug);
        }
        const sortedPosts = [...(response.result.posts || [])]
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime(),
          )
          .slice(0, 3);
        setPosts(sortedPosts);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 md:gap-2">
      <h2>Recent posts</h2>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-6">
        {posts.map((post) => (
          <PostCard artistSlug={artistSlug} key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}
