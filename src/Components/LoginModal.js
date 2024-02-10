'use client'
import React, { useState } from 'react';
import setcookie from "@/Components/Cookies";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const LoginModal = ({ isOpen, toggleModal }) => {
    library.add(faEye, faEyeSlash)
    const [uname, setUname] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleEmailChange = (e) => {
        setUname(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the data
        const userData = {
            username: uname,
            password: password
        };

        // console.log(body)
        // Send POST request
        fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/Auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text()
            })
            .then(data => {
                // Handle successful login response
                setcookie(data)
                // Close the modal after successful login
                toggleModal();
            })
            .catch(error => {
                // Handle error
                console.error('Error logging in:', error);
                // You can add code here to display an error message to the user
            });
    };

    return (
        <>
            {isOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 opacity-90 backdrop-filter backdrop-blur-sm"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

                        <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full group bg-gradient-to-br p-1.5 from-purple-500 to-indigo-700  dark:text-white">
                            <div className="bg-white dark:bg-gray-950 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded">
                                <div className="">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200" id="modal-title">
                                            Login bucko :3
                                        </h3>
                                        <div className="mt-2">
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                    <label htmlFor="text"
                                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                                    <input type="text" id="uname" name="uname" value={uname}
                                                           onChange={handleEmailChange} autoComplete="email" required
                                                           className="mt-1 p-2 border border-gray-300 dark:border-gray-700 block w-full shadow-sm sm:text-sm rounded-md text-gray-800 dark:text-gray-800"/>
                                                </div>
                                                <div className="relative">
                                                    <label htmlFor="password"
                                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                                    <input type={showPassword ? "text" : "password"} id="password"
                                                           name="password"
                                                           value={password} onChange={handlePasswordChange}
                                                           autoComplete="current-password" required
                                                           className="mt-1 p-2 border border-gray-300 dark:border-gray-700 block w-full shadow-sm sm:text-sm rounded-md text-gray-800 dark:text-gray-800"/>
                                                    <button type="button" onClick={togglePasswordVisibility}
                                                            className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300 focus:outline-none">
                                                        {showPassword ? (
                                                            <span className="pt-6 pr-1 text-gray-900 items-center"> {<FontAwesomeIcon icon={"eye"}/>}</span>
                                                        ) : (
                                                            <span className="pt-6 pr-1 text-gray-900 items-center"> {<FontAwesomeIcon icon={"eye-slash"}/>}</span>
                                                        )}
                                                    </button>
                                                </div>
                                                <button type="submit"
                                                        className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
                                                    Sign in
                                                </button>
                                                <button onClick={toggleModal} type="button"
                                                        className="absolute right-5 text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
                                                    Cancel
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginModal;