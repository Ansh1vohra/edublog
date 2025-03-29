import React, { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { Link } from 'react-router';
import "./Home.css";


interface BlogPostType {
    _id: string;
    title: string;
    content: string;
    userMail: string;
    authorName: string;
    blogImg?: string;
    createdAt?: Date;
}

export default function Home() {
    const { userMail } = useUser();
    const [userName, setUserName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [blogs, setBlogs] = useState<BlogPostType[]>([]);
    const [search, setSearch] = useState<string>(''); // Search state

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (userMail) {
                try {
                    const response = await fetch('https://edublog-server.vercel.app/api/users/fetchUser', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
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
                const response = await fetch('https://edublog-server.vercel.app/api/blogs');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBlogs(data);
            } catch (error: any) {
                setError('Failed to fetch blogs. Please try again.');
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userMail) fetchUserDetails();
        fetchBlogs();
    }, [userMail]);

    // Filter blogs based on search input
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className='flex flex-col items-center p-4 text-2xl'>
            {userName && <p>Welcome, {userName}!</p>}
            <br />
            <h1 className='font-semibold text-3xl'>Blogs</h1>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search blogs by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 m-4 rounded-md w-full sm:w-1/2 text-lg"
            />

            {loading ? (
                <div className='h-80'>
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
                </div>
            ) : error ? (
                <p className="h-80 text-red-500">{error}</p>
            ) : (
                <div className="p-4 m-4 flex flex-wrap justify-evenly">
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map(blog => (
                            <Link to={`/blog/${blog._id}`} key={blog._id}>
                                <div className='card m-2'>
                                    <img src={blog.blogImg} alt="blogImage" />
                                    <h2 className='p-2'>{blog.title}</h2>
                                    <p className="text-base p-2">
                                        {blog.createdAt ? new Intl.DateTimeFormat("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        }).format(new Date(blog.createdAt)) : "Unknown Date"}
                                    </p>
                                    <p className="text-base p-2">By: {blog.authorName}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">No blogs found.</p>
                    )}
                </div>
            )}
        </main>
    );
}
