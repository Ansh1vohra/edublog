import React, { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { Link } from 'react-router';
import "./Home.css";

interface BlogPostType {
    _id: string;
    title: string;
    content: string;
    userMail: string;
    blogImg?: string;
    createdAt?: Date;
}

export default function Home() {
    const { userMail } = useUser();
    const [userName, setUserName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true); // Initial loading state
    const [error, setError] = useState<string>('');
    const [blogs, setBlogs] = useState<BlogPostType[]>([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (userMail) {
                try {
                    const response = await fetch('http://localhost:5000/api/users/fetchUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userMail: userMail }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        setUserName(data.authorName || 'User');
                        console.log('User Details found!');
                    } else {
                        setError(data.error || 'Failed to fetch user details.');
                        console.error(data.error || 'Failed to fetch user details.');
                    }
                } catch (error: any) {
                    setError('Failed to fetch user details. Please try again.');
                    console.error("Error fetching user:", error);
                }
            }
        };

        const fetchBlogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/blogs');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBlogs(data);
            } catch (error: any) {
                setError('Failed to fetch blogs. Please try again.');
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        // Call both functions
        if (userMail) {
            fetchUserDetails();
        }
        fetchBlogs();
    }, [userMail]);

    return (
        <>
            <main className='flex flex-col items-center p-4 text-2xl'>
                {userName && <p>Welcome, {userName}!</p>}
                <br></br>
                <h1>Blogs</h1>
                {loading ? (
                    <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">
                        <span
                            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        ></span>
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="p-4 m-4 flex">
                        {blogs.map(blog => (
                            <Link to={`/blog/${blog._id}`} key={blog._id}>
                                <div className='card'>
                                    <img src={blog.blogImg} alt="blogImage" />
                                    <h2 className='font-semibold p-2'>{blog.title}</h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
