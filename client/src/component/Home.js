import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../url';

const Home = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(''); // Add state to keep track of user role

    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                var role = localStorage.getItem("role"); // Assume the response contains the user's role
                setUserRole(role);
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                // Fetch the class data from the API
                const response = await axios.get(API_ENDPOINTS.GET_ALL_CLASS, config);
                setClasses(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load classes. Please try again.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchClasses();
    }, []);

    const handleEnroll = async (classId) => {
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

            // Enroll the user in the selected class
            await axios.post(`http://localhost:3001/api/enroll/${classId}`, {}, config);
            alert('Successfully enrolled in the class!');
        } catch (err) {
            console.error(err);
            alert('Failed to enroll in the class. Please try again.');
        }
    };

    const handleLogOut = () => {
        localStorage.clear();
        console.log("Logout");
        navigate("/login");
    }

    if (loading) return <div className="text-center text-lg text-gray-500">Loading...</div>;

    if (error) return <div className="text-center text-lg text-red-500">{error}</div>;

    return (
        <div className="flex min-h-full flex-col px-6 py-12 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-900 mb-6">
                    Available Classes
                </h2>
                <button
                    onClick={()=>navigate("/user")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    User Eroll Class
                </button>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map((cls) => (
                        <div key={cls._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">{cls.title}</h3>
                            <p className="text-gray-700 mt-2">Instructor ID: {cls.instructor}</p>

                            <div className="mt-4">
                                <h4 className="text-md font-semibold text-gray-800">Units:</h4>
                                {Array.isArray(cls.units) && cls.units.length > 0 ? (
                                    <ul className="list-disc list-inside mt-2">
                                        {cls.units.map((unit, index) => (
                                            <li key={index} className="text-gray-700 mt-2">
                                                <div className="font-medium">Unit Title: {unit.title || 'N/A'}</div>
                                                <div className="mt-2">
                                                    <h5 className="font-semibold">Sessions:</h5>
                                                    {Array.isArray(unit.sessions) && unit.sessions.length > 0 ? (
                                                        <ul className="list-disc list-inside mt-2">
                                                            {unit.sessions.map((session, i) => (
                                                                <li key={i} className="text-gray-600">
                                                                    Session Title: {session.title || 'N/A'}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No sessions available</p>
                                                    )}
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="font-semibold">Lectures:</h5>
                                                    {Array.isArray(unit.lectures) && unit.lectures.length > 0 ? (
                                                        <ul className="list-disc list-inside mt-2">
                                                            {unit.lectures.map((lecture, i) => (
                                                                <li key={i} className="text-gray-600">
                                                                    Lecture ID: {lecture || 'N/A'}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No lectures available</p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No units available</p>
                                )}
                            </div>

                            {/* Enroll button visible only for students */}
                            {userRole === 'student' && (
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => handleEnroll(cls._id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Enroll
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={handleLogOut}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                Logout
            </button>
        </div>
    );
};

export default Home;
