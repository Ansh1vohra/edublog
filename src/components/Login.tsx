import React, { useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router';
import { useUser } from '../Context/UserContext';

export default function Login() {
    const nav = useNavigate();
    const { setUserMail } = useUser();
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [generatedOtp, setGeneratedOtp] = useState<string>('');
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [dbLoading, setDbLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const collegeDomain = "@vitstudent.ac.in";

    const extractAuthorName = (email: string) => {
        const regex = /^([a-zA-Z]+)\.([a-zA-Z]+)\d{4}@vitstudent\.ac\.in$/;
        const match = email.match(regex);
        if (match) {
            return `${match[1]} ${match[2]}`; // Extracts Firstname Lastname
        }
        return "";
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        
        if (!email.endsWith(collegeDomain)) {
            setMessage('Only VIT students can login with their official email.');
            return;
        }

        setLoading(true);
    
        // Generate OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
    
        try {
            const response = await fetch('https://edublog-server.vercel.app/api/users/sendOTP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, OTP: newOtp }),
            });
    
            const data = await response.json();
            if (response.ok) {
                setOtpSent(true);
                setMessage('OTP has been sent to your email.');
            } else {
                setMessage(data.error || 'Failed to send OTP. Try again.');
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            setMessage('Failed to generate OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setDbLoading(true);

        if (otp === generatedOtp) {
            const authorName = extractAuthorName(email);
            if (!authorName) {
                setMessage("Invalid VIT email format. Please try again.");
                setDbLoading(false);
                return;
            }

            setMessage('OTP Verified!');

            try {
                const response = await fetch('https://edublog-server.vercel.app/api/users/storeUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userMail: email, authorName: authorName }),
                });

                const data = await response.json();
                if (response.ok || data.error === 'User already exists') {
                    setUserMail(email);
                    localStorage.setItem('userMail', email);
                    setMessage('Login Success');
                    nav("/");
                } else {
                    setMessage(data.error || 'Failed to Login');
                }
            } catch (error) {
                console.error("Error Logging in:", error);
                setMessage('Failed to Login. Please try again.');
            } finally {
                setDbLoading(false);
            }
        } else {
            setMessage('Incorrect OTP. Please try again.');
            setDbLoading(false);
        }
    };

    return (
        <div className="flex justify-center mt-8 loginContainer items-center">
            <div className="bg-white shadow-md rounded-lg p-6 m-4 w-full max-w-md flex flex-col justify-center items-center border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
                {!otpSent ? (
                    <form className='flex flex-col gap-4 justify-center items-center w-full' onSubmit={handleSendOtp}>
                        <div className="w-full">
                            <input
                                type="email"
                                id="email"
                                className="mt-1 p-3 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter Your VIT e-mail"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <div className='flex flex-col gap-4 justify-center items-center w-full'>
                        <div className="w-full">
                            <input
                                type="text"
                                id="otp"
                                className="mt-1 p-3 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter OTP"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button
                            className="w-full py-3 px-4 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            onClick={handleVerifyOtp}
                            disabled={dbLoading}
                        >
                            {dbLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                )}
                {message && <p className="mt-4 text-sm text-gray-600 text-center">{message}</p>}
            </div>
        </div>
    );
}
