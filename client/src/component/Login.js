import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../url';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!email || !password) {
            setError('Both email and password are required.');
            return;
        }

        try {
            // POST request to login endpoint
            const response = await axios.post(API_ENDPOINTS.AUTH, { email, password });
            console.log(response)
            const { token } = response.data;
            if (token) {
                // Store the token in local storage
                localStorage.setItem('token', token);
                const decoded = jwtDecode(token);
                console.log(decoded)
                localStorage.setItem("userId", decoded.id);
                localStorage.setItem("role", decoded.role);
                    

                // Optionally, you can also store additional information such as user info or role
                // localStorage.setItem('user', JSON.stringify(response.data.users));

                // Handle successful login (e.g., redirect to another page)
                console.log("Login successful!");
                // Handle successful login
                setSuccess('Login successful! Redirecting...');
                setError('');
                navigate("/");
                return { success: true };
                // Redirect or update state as needed
            }

            // Redirect or perform other actions on success
            // For example, redirect to a dashboard or store token in localStorage
            // window.location.href = '/dashboard'; // Example redirection
        } catch (err) {
            // Handle errors
            setError('Login failed. Please check your email and password.');
            setSuccess('');
            console.error('Login error:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            {/* Uncomment if you want a "Forgot password?" link */}
                            {/* <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div> */}
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Login
                        </button>
                    </div>
                </form>

                {error && (
                    <p className="mt-10 text-center text-sm text-red-500">{error}</p>
                )}
                {success && (
                    <p className="mt-10 text-center text-sm text-green-500">{success}</p>
                )}

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
