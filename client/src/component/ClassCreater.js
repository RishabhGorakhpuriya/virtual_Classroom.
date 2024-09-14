import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../url'; // Adjust this according to your API endpoints

const ClassCreater = () => {
    const [step, setStep] = useState(1); // Track the current step
    const [className, setClassName] = useState('');
    const [units, setUnits] = useState([]);
    const [currentUnit, setCurrentUnit] = useState({ title: '', sessions: [] });
    const [currentSession, setCurrentSession] = useState({ title: '', lectures: [] });
    const [lectures, setLectures] = useState([]);
    const [newLecture, setNewLecture] = useState({ title: '', content: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Retrieve instructor ID from local storage
    const instructorId = localStorage.getItem('userId'); // Ensure this is set correctly in your app

    useEffect(() => {
        // Fetch available lectures from API for session creation
        axios.get(API_ENDPOINTS.LECTURES)
            .then(response => setLectures(response.data))
            .catch(error => console.error('Error fetching lectures:', error));
    }, []);

    useEffect(() => {
        // Log current unit for debugging
        console.log(currentUnit);
    }, [currentUnit]);

    // Handle Class Creation
    const handleClassSubmit = async (e) => {
        e.preventDefault();
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
            const response = await axios.post(API_ENDPOINTS.CLASS, {
                title: className,
                instructor: instructorId
            }, config);
            setSuccessMessage('Class created successfully!');
            setErrorMessage('');
            setStep(2); // Move to the next step
        } catch (error) {
            setErrorMessage('Failed to create class. Please try again.');
            setSuccessMessage('');
            console.error(error.stack);
        }
    };

    // Handle Unit Addition
    const handleAddUnit = () => {
        if (currentUnit.title) {
            setUnits([...units, currentUnit]);
            setCurrentUnit({ title: '', sessions: [] });
        }
        setStep(2); // Stay on the units step
    };

    // Handle Session Addition
    const handleAddSession = () => {
        const updatedUnit = {
            ...currentUnit,
            sessions: [...currentUnit.sessions, currentSession]
        };
        setCurrentUnit(updatedUnit);
        setCurrentSession({ title: '', lectures: [] });
    };

    // Handle Lecture Addition
    const handleAddLecture = (lectureId) => {
        const updatedSession = {
            ...currentSession,
            lectures: [...currentSession.lectures, lectureId]
        };
        const updatedUnit = {
            ...currentUnit,
            sessions: currentUnit.sessions.map(session =>
                session.title === currentSession.title ? updatedSession : session
            )
        };
        setCurrentUnit(updatedUnit);
        setCurrentSession(updatedSession);
    };

    // Handle Lecture Creation
    const createLecture = async () => {
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
            const response = await axios.post("http://localhost:3001/api/sessions/lectures", {
                title: newLecture.title,
                content: newLecture.content
            }, config);
            setLectures([...lectures, response.data]);
            setNewLecture({ title: '', content: '' });
            setSuccessMessage('Lecture created successfully!');
        } catch (error) {
            setErrorMessage('Failed to create lecture. Please try again.');
            console.error(error.stack);
        }
    };

    // Handle Final Submission
    const handleFinalSubmit = async () => {
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

            const classIdResponse = await axios.post(API_ENDPOINTS.CLASS, {
                title: className,
                instructor: instructorId
            }, config);
            const classId = classIdResponse.data._id; // Get the created class ID

            await axios.put(API_ENDPOINTS.UPDATE_CLASS + '/' + classId, {
                units: units
            }, config);

            setSuccessMessage('Class updated with units, sessions, and lectures successfully!');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Failed to update class. Please try again.');
            setSuccessMessage('');
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Create and Manage Class
                </h2>

                {step === 1 && (
                    <form onSubmit={handleClassSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="className" className="block text-sm font-medium leading-6 text-gray-900">
                                Class Name
                            </label>
                            <input
                                id="className"
                                name="className"
                                type="text"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                            >
                                Create Class
                            </button>
                        </div>

                        {errorMessage && (
                            <p className="text-center text-sm text-red-500">{errorMessage}</p>
                        )}
                        {successMessage && (
                            <p className="text-center text-sm text-green-500">{successMessage}</p>
                        )}
                    </form>
                )}

                {step === 2 && (
                    <div>
                        <h3 className="text-center text-xl font-bold leading-8 text-gray-900">Add Units</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddUnit();
                            }}
                            className="space-y-6"
                        >
                            <div>
                                <label htmlFor="unitTitle" className="block text-sm font-medium leading-6 text-gray-900">
                                    Unit Title
                                </label>
                                <input
                                    id="unitTitle"
                                    name="title"
                                    type="text"
                                    value={currentUnit.title}
                                    onChange={(e) => setCurrentUnit({ ...currentUnit, title: e.target.value })}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Add Unit
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <h4 className="text-lg font-semibold leading-6 text-gray-900">Units</h4>
                            {units.map((unit, index) => (
                                <div key={index} className="mt-4">
                                    <h5 className="text-md font-semibold text-gray-700">{unit.title}</h5>
                                    <button
                                        onClick={() => {
                                            setCurrentUnit(unit);
                                            setStep(3);
                                        }}
                                        className="mt-2 text-indigo-600 hover:underline"
                                    >
                                        Add Sessions to this Unit
                                    </button>
                                </div>
                                )
                            )}

                            <button
                                onClick={handleFinalSubmit}
                                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 mt-4"
                            >
                                Finalize Class
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3 className="text-center text-xl font-bold leading-8 text-gray-900">Add Sessions</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddSession();
                            }}
                            className="space-y-6"
                        >
                            <div>
                                <label htmlFor="sessionTitle" className="block text-sm font-medium leading-6 text-gray-900">
                                    Session Title
                                </label>
                                <input
                                    id="sessionTitle"
                                    name="title"
                                    type="text"
                                    value={currentSession.title}
                                    onChange={(e) => setCurrentSession({ ...currentSession, title: e.target.value })}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Add Session
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <h4 className="text-lg font-semibold leading-6 text-gray-900">Sessions</h4>
                            {currentUnit.sessions.map((session, index) => (
                                <div key={index} className="mt-4">
                                    <h5 className="text-md font-semibold text-gray-700">{session.title}</h5>
                                    <button
                                        onClick={() => {
                                            setCurrentSession(session);
                                            setStep(4);
                                        }}
                                        className="mt-2 text-indigo-600 hover:underline"
                                    >
                                        Add Lectures to this Session
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h3 className="text-center text-xl font-bold leading-8 text-gray-900">Add Lectures</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                createLecture();
                            }}
                            className="space-y-6"
                        >
                            <div>
                                <label htmlFor="lectureTitle" className="block text-sm font-medium leading-6 text-gray-900">
                                    Lecture Title
                                </label>
                                <input
                                    id="lectureTitle"
                                    name="lectureTitle"
                                    type="text"
                                    value={newLecture.title}
                                    onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <label htmlFor="lectureContent" className="block text-sm font-medium leading-6 text-gray-900">
                                    Lecture Content
                                </label>
                                <textarea
                                    id="lectureContent"
                                    name="lectureContent"
                                    rows="4"
                                    value={newLecture.content}
                                    onChange={(e) => setNewLecture({ ...newLecture, content: e.target.value })}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Create Lecture
                                </button>
                            </div>
                        </form>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddLecture(currentSession.lectureId);
                            }}
                            className="space-y-6 mt-6"
                        >
                            <div>
                                <label htmlFor="lecture" className="block text-sm font-medium leading-6 text-gray-900">
                                    Select Lecture
                                </label>
                                <select
                                    id="lecture"
                                    onChange={(e) => setCurrentSession({ ...currentSession, lectureId: e.target.value })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select Lecture</option>
                                    {lectures.map(lecture => (
                                        <option key={lecture._id} value={lecture._id}>{lecture.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Add Lecture
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <h4 className="text-lg font-semibold leading-6 text-gray-900">Lectures</h4>
                            {currentSession.lectures.map((lectureId, index) => (
                                <div key={index} className="mt-4">
                                    <span className="text-md font-semibold text-gray-700">
                                        {lectures.find(lecture => lecture._id === lectureId)?.title || 'Unknown Lecture'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    const updatedUnits = units.map(unit =>
                                        unit.title === currentUnit.title ? currentUnit : unit
                                    );
                                    setUnits(updatedUnits);
                                    setStep(2); // Back to units step
                                }}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                            >
                                Save Unit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassCreater;
