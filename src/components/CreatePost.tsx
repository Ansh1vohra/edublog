import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

export default function CreatePost() {
    const { userMail } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userMail) {
            navigate('/login'); // Redirect to the login page
        }
    }, [userMail, navigate]);

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [blogImg, setBlogImg] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>(''); // State to hold the file name

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userMail) {
            setMessage('You must be logged in to create a post.');
            return;
        }

        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('userMail', userMail);
        if (blogImg) {
            formData.append('blogImg', blogImg);
        }

        try {
            const response = await fetch('http://localhost:5000/api/blogs', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Blog post created successfully!');
                // Reset form fields
                setTitle('');
                setContent('');
                setBlogImg(null);
                setFileName('');
            } else {
                setMessage(data.error || 'Failed to create blog post.');
            }
        } catch (error: any) {
            setMessage(error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setBlogImg(e.target.files[0]);
            setFileName(e.target.files[0].name); // Set the file name for display
        } else {
            setBlogImg(null);
            setFileName('');
        }
    };

    return (
        <>
            {userMail ? (
                <form className="blogForm flex flex-col gap-2 p-4 m-4" onSubmit={handleSubmit}>
                    <h1 className='text-center'>Create a blog or ask a question</h1>
                    <input
                        type='text'
                        className='p-3'
                        placeholder="Blog Title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label className="block mt-4">Banner for the Blog:</label>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden" // Hide the default file input
                        id="file-input" // Assign an ID to link with the label
                    />

                    {/* Custom File Input Label */}
                    <label htmlFor="file-input" className="bg-blue-300 text-white p-2 rounded cursor-pointer hover:bg-blue-400">
                        {fileName || 'Select Image'} {/* Display selected file name or prompt */}
                    </label>

                    <textarea
                        placeholder="Blog Content"
                        className='p-3'
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <button type="submit" className='bg-blue-300 p-2 rounded hover:bg-blue-400' disabled={loading}>
                        {loading ? 'Creating...' : 'Create Post'}
                    </button>
                    {message && <p>{message}</p>}
                </form>
            ) : null}
        </>
    );
}
