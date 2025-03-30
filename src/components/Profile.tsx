import React, { useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";
import "./Profile.css";

export default function Profile() {
    const { userMail } = useUser();
    const [userData, setUserData] = useState({
        authorName: "",
        imgUrl: "",
    });
    const [newName, setNewName] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [nameLoading, setNameLoading] = useState(false);
    const [error, setError] = useState("");

    // Function to fetch user details
    const fetchUserDetails = async () => {
        if (!userMail) {
            console.log("User email is undefined, skipping API call.");
            return;
        }

        try {
            const response = await fetch("https://edublog-server.vercel.app/api/users/fetchUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMail }),
            });

            const data = await response.json();
            if (response.ok) {
                setUserData({ authorName: data.authorName, imgUrl: data.imgUrl });
                setNewName(data.authorName);
            } else {
                setError(data.error || "Failed to fetch user details.");
            }
        } catch (error) {
            setError("Something went wrong while fetching user data.");
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [userMail]);

    // Function to update user name
    const updateName = async () => {
        if (!newName.trim()) return;
        setNameLoading(true);
        try {
            const response = await fetch("https://edublog-server.vercel.app/api/users/updateAuthorName", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMail, authorName: newName }),
            });

            const data = await response.json();
            if (data) {
                setNameLoading(false);
                console.log(data.message);
                const element = document.getElementById("updatedNameMsg");
                if (element) {
                    element.innerHTML = data.message;
                    element.classList.remove("hidden");
                }
            } else {
                setError(data.error || "Failed to update name.");
            }
        } catch (error) {
            setError("Something went wrong while updating the name.");
        }
    };

    // Handle Image Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedImage(file);

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
        }
    };

    // Upload New Profile Picture
    const updateProfilePicture = async () => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append("userMail", userMail);
        formData.append("imgUrl", selectedImage);

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/users/updateAuthorImage", {
                method: "PUT",
                body: formData,
            });

            const data = await response.json();
            if (data) {
                setLoading(false);
                console.log(data.message);
                const element = document.getElementById("updatedImgMsg");
                if (element) {
                    element.innerHTML = data.message;
                    element.classList.remove("hidden");
                }
            } else {
                setError(data.error || "Failed to update profile picture.");
            }
        } catch (error) {
            setError("Something went wrong while updating profile picture.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {userMail ? (
                <div className="profile-section">
                    <div className="flex flex-col items-center p-6 bg-green-100 mx-2 rounded">
                        <h1 className="text-3xl font-bold">Profile</h1>
                        {error && <p className="text-red-500">{error}</p>}

                        <div className="flex flex-col items-center mt-4">
                            <img
                                src={previewUrl || userData.imgUrl || "/default-avatar.png"}
                                alt="Profile"
                                className="w-40 h-40 rounded-full border shadow-md object-cover"
                            />

                            {/* Upload Image */}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
                            <button
                                onClick={updateProfilePicture}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Profile Picture"}
                            </button>
                            <p id="updatedImgMsg" className="text-center hidden"></p>

                            {/* Update Name */}
                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="border p-2 rounded-md"
                                />
                                <button
                                    onClick={updateName}
                                    className="m-2 bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    {nameLoading ? "Updating..." : "Update Author Name"}
                                </button>
                                <p id="updatedNameMsg" className="text-center hidden"></p>
                            </div>
                        </div>
                    </div>
                </div>

            ) : null}
        </>
    );
}
