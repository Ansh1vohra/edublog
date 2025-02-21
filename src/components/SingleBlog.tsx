import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface BlogPostType {
    _id: string;
    title: string;
    content: string;
    userMail: string;
    blogImg?: string;
    createdAt?: Date;
}

const SingleBlog = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBlog(data);
            } catch (error: any) {
                setError(error.message || 'Failed to fetch blog.');
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    return (
        <div className="single-blog-container">
            {loading ? (
                <p>Loading blog...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : blog ? (
                <div>
                    <h2>{blog.title}</h2>
                    <img src={blog.blogImg} alt="blogImage" width='200px' />
                    <p>{blog.content}</p>
                </div>
            ) : (
                <p>Blog not found.</p>
            )}
        </div>
    );
};

export default SingleBlog;
