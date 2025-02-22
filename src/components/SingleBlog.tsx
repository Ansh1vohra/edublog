import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import "./SingleBlog.css";


interface BlogType {
  _id: string;
  title: string;
  content: string;
  blogImg: string;
  userMail: string;
  date: string;
  authorName?: string;
}

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    setShareUrl(window.location.href);

    async function fetchBlog() {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (response.ok) {
          const blogData: BlogType = await response.json();

          try {
            const userResponse = await fetch('http://localhost:5000/api/users/fetchUser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userMail: blogData.userMail }),
            });

            if (userResponse.ok) {
              const user = await userResponse.json();
              blogData.authorName = user.authorName || 'Unknown Author';
            } else {
              console.error('Error fetching user for', blogData.userMail);
              blogData.authorName = 'Unknown Author';
            }
          } catch (err) {
            console.error('Error fetching author name:', err);
            blogData.authorName = 'Unknown Author';
          }

          setBlog(blogData);
        } else {
          console.error('Failed to fetch blog');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    }

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div className="p-4 mt-4">Loading...</div>;
  }

  return (
    <div className="blogContainer">
      <div className='innerblogContainer'>
        <div>
          <h2 className="text-2xl font-bold">{blog.title}</h2>
          <p className="text-sm text-gray-600">
            Posted on: {new Date(blog.date).toLocaleDateString()}
          </p>
        </div>
        <p className="text-sm">Author: {blog.authorName}</p>

        <img src={blog.blogImg} className='rounded-md' alt="blogImage" />

        <p className="whitespace-pre-wrap leading-relaxed">{blog.content}</p>

        <div className="mb-3 space-x-2">
          <FacebookShareButton url={shareUrl} hashtag={`#${blog.title}`}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={blog.title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl} title={blog.title}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <WhatsappShareButton url={shareUrl} title={blog.title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
      </div>
    </div>
  );
}
