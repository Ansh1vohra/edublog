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
  createdAt: string;
  authorName?: string;
}

interface CommentType {
  _id: string;
  text: string;
  author: string;
  createdAt: string;
  replies: { text: string; author: string; createdAt: string }[];
}

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState({ text: '', author: '' });
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});


  async function fetchComments() {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}/comments`);
      if (response.ok) {
        const commentsData: CommentType[] = await response.json();
        setComments(commentsData);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

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
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userMail: blogData.userMail }),
            });

            if (userResponse.ok) {
              const user = await userResponse.json();
              blogData.authorName = user.authorName || 'Unknown Author';
            } else {
              blogData.authorName = 'Unknown Author';
            }
          } catch (err) {
            blogData.authorName = 'Unknown Author';
          }

          setBlog(blogData);
          fetchComments();
        } else {
          console.error('Failed to fetch blog');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    }

    fetchBlog();
  }, [id]);

  async function handleAddComment() {
    if (!newComment.text || !newComment.author) return;

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        setNewComment({ text: '', author: '' });
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }

  async function handleAddReply(commentId: string) {
    if (!replyText[commentId]) return;

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText[commentId], author: 'User' }),
      });

      if (response.ok) {
        setReplyText((prev) => ({ ...prev, [commentId]: '' }));
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  }

  if (!blog) {
    return <div className="p-4 mt-4 h-96">Loading...</div>;
  }

  return (
    <div className="blogContainer">
      <div className='innerblogContainer'>
        <h2 className="text-2xl font-bold">{blog.title}</h2>
        <p className="text-sm text-gray-600">
          Posted on: {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(blog.createdAt))}
        </p>
        <p className="font-bold">By: {blog.authorName}</p>
        <img src={blog.blogImg} className='rounded-md' alt="blogImage" />
        <p className="whitespace-pre-wrap leading-relaxed">{blog.content}</p>

        {/* Share buttons */}
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

        {/* Comments Section */}
        <h3 className="mt-6 text-xl font-semibold">Comments</h3>
        <div className="mt-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border p-3 mb-3 rounded-md">
              <p className="font-semibold">{comment.author}:</p>
              <p>{comment.text}</p>
              <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>

              {/* Replies */}
              <div className="ml-4 mt-2">
                {comment.replies.map((reply, index) => (
                  <div key={index} className="border-l pl-2 ml-2">
                    <p className="font-semibold">{reply.author}:</p>
                    <p>{reply.text}</p>
                    <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Add Reply */}
              <input
                type="text"
                placeholder="Write a reply..."
                className="border p-2 mt-2 w-full rounded-md"
                value={replyText[comment._id] || ''}
                onChange={(e) => setReplyText((prev) => ({ ...prev, [comment._id]: e.target.value }))}
              />
              <button onClick={() => handleAddReply(comment._id)} className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2">
                Reply
              </button>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <h3 className="mt-6 text-xl font-semibold">Add a Comment</h3>
        <input
          type="text"
          placeholder="Your name"
          className="border p-2 w-full rounded-md mt-2"
          value={newComment.author}
          onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
        />
        <textarea
          placeholder="Write a comment..."
          className="border p-2 w-full rounded-md mt-2"
          value={newComment.text}
          onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
        />
        <button onClick={handleAddComment} className="bg-green-500 text-white px-3 py-1 rounded-md mt-2">
          Comment
        </button>
      </div>
    </div>
  );
}
