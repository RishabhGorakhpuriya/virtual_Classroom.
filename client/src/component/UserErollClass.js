import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserErollClass = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = localStorage.getItem("userId")
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost:3001/api/user/${userId}`, config);
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load user data. Please try again.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) return <div className="text-center text-lg text-gray-500">Loading...</div>;

    if (error) return <div className="text-center text-lg text-red-500">{error}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">User Details</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
                <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <h2 className="text-xl font-semibold mb-4">Enrolled Classes</h2>
            {user.enrolledClasses.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {user.enrolledClasses.map((cls) => (
                        <div key={cls._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">{cls.title}</h3>
                            {cls.units.length > 0 ? (
                                <div>
                                    {cls.units.map((unit) => (
                                        <div key={unit._id} className="mb-4">
                                            <h4 className="font-semibold">Unit: {unit.title}</h4>
                                            {unit.sessions.length > 0 ? (
                                                <ul>
                                                    {unit.sessions.map((session, idx) => (
                                                        <li key={idx}>{session.title}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No sessions available.</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No units available.</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No classes enrolled.</p>
            )}
        </div>
    )
}

export default UserErollClass
