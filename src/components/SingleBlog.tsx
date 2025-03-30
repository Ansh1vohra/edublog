import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import "./SingleBlog.css";
import "./Home.css"

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
  const navigate = useNavigate();
  const { userMail } = useUser();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState<{ [key: string]: boolean }>({});


  useEffect(() => {
    async function fetchBlogAndComments() {
      try {
        // Fetch Blog
        const blogResponse = await fetch(`https://edublog-server.vercel.app/api/blogs/${id}`);
        if (blogResponse.ok) {
          const blogData: BlogType = await blogResponse.json();

          // Fetch Author Name
          const userResponse = await fetch("https://edublog-server.vercel.app/api/users/fetchUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMail: blogData.userMail }),
          });

          if (userResponse.ok) {
            const user = await userResponse.json();
            blogData.authorName = user.authorName || "Unknown Author";
          } else {
            blogData.authorName = "Unknown Author";
          }

          setBlog(blogData);
        }

        // Fetch Comments
        const commentsResponse = await fetch(`https://edublog-server.vercel.app/api/comments/posts/${id}/comments`);
        if (commentsResponse.ok) {
          setComments(await commentsResponse.json());
        }
      } catch (error) {
        console.error("Error fetching blog/comments:", error);
      }
    }

    fetchBlogAndComments();
  }, [id]);

  // Handle Adding Comment
  const handleAddComment = async () => {
    if (!userMail) {
      alert("Please sign in to add a comment.");
      navigate("/signin"); // Redirect to Sign-In page
      return;
    }

    try {
      const userResponse = await fetch("https://edublog-server.vercel.app/api/users/fetchUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMail }),
      });

      if (!userResponse.ok) throw new Error("Failed to fetch user");

      const user = await userResponse.json();
      const authorName = user.authorName || "Anonymous";

      const response = await fetch(`https://edublog-server.vercel.app/api/comments/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText, author: authorName }),
      });

      if (response.ok) {
        setCommentText("");
        setComments([...comments, { _id: Date.now().toString(), text: commentText, author: authorName, createdAt: new Date().toISOString(), replies: [] }]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle Adding Reply
  const handleAddReply = async (commentId: string) => {
    if (!userMail) {
      alert("Please sign in to reply.");
      navigate("/signin");
      return;
    }

    try {
      const userResponse = await fetch("https://edublog-server.vercel.app/api/users/fetchUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMail }),
      });

      if (!userResponse.ok) throw new Error("Failed to fetch user");

      const user = await userResponse.json();
      const authorName = user.authorName || "Anonymous";

      const response = await fetch(`https://edublog-server.vercel.app/api/comments/commentReply/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText[commentId], author: authorName }),
      });

      if (response.ok) {
        setReplyText({ ...replyText, [commentId]: "" });
        setComments(comments.map((comment) => (comment._id === commentId ? { ...comment, replies: [...comment.replies, { text: replyText[commentId], author: authorName, createdAt: new Date().toISOString() }] } : comment)));
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  if (!blog) return <div className="p-4 mt-4 h-96">
    <div className='h-80'>
      <div className="m-6 loader"></div>
    </div>
  </div>;

  return (
    <div className="blogContainer">
      <div className="innerblogContainer">
        <h2 className="text-2xl font-bold">{blog.title}</h2>
        <p className="text-sm text-gray-600">Posted on: {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(blog.createdAt))}</p>
        <p className="font-bold">By: {blog.authorName}</p>
        <img src={blog.blogImg} className="rounded-md" alt="blogImage" />
        <p className="whitespace-pre-wrap leading-relaxed">{blog.content}</p>

        <div className="comments-section">
          <h3 className="text-lg font-bold mt-4">Comments</h3>

          {/* Toggle Comment Box */}
          {userMail ? (
            <>
              <button
                onClick={() => setShowCommentBox(!showCommentBox)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {showCommentBox ? "Cancel" : "Add Comment"}
              </button>

              {showCommentBox && (
                <div className="mt-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 border rounded-md"
                  ></textarea>
                  <button
                    onClick={handleAddComment}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Sign in to Comment
            </button>
          )}

          {/* Display Comments */}
          {comments.map((comment) => (
            <div key={comment._id} className="mt-4 border p-2 rounded-md">
              <p>
                <b>{comment.author}</b>: {comment.text}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>

              {/* Toggle Reply Box */}
              {userMail ? (
                <>
                  <button
                    onClick={() =>
                      setShowReplyBox({
                        ...showReplyBox,
                        [comment._id]: !showReplyBox[comment._id],
                      })
                    }
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    {showReplyBox[comment._id] ? "Cancel" : "Reply"}
                  </button>

                  {showReplyBox[comment._id] && (
                    <div className="my-4">
                      <textarea
                        value={replyText[comment._id] || ""}
                        onChange={(e) =>
                          setReplyText({ ...replyText, [comment._id]: e.target.value })
                        }
                        placeholder="Reply..."
                        className="w-full p-2 border rounded-md"
                      ></textarea>
                      <button
                        onClick={() => handleAddReply(comment._id)}
                        className="mt-1 bg-green-500 text-white px-4 py-2 rounded-md"
                      >
                        Submit Reply
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="mt-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Sign in to Reply
                </button>
              )}

              {/* Display Replies */}
              {comment.replies.map((reply, index) => (
                <div key={index}>
                  <p className="ml-4 text-sm">
                    <b>{reply.author}</b>: {reply.text}
                  </p>
                  <p className="ml-4 text-xs text-gray-500">
                    {new Date(reply.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
