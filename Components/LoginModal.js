'use client'
import React, { useState } from 'react';

const LoginModal = ({ isOpen, toggleModal }) => {
    const [uname, setUname] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (e) => {
        setUname(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Your login logic here
        console.log("Logging in with email:", uname, "and password:", password);
        // Close the modal after login
        toggleModal();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-950 opacity-90 backdrop-filter backdrop-blur-lg"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-gray-950 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200" id="modal-title">
                                            Login bucko :3
                                        </h3>
                                        <div className="mt-2">
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                                    <input type="text" id="uname" name="uname" value={uname} onChange={handleEmailChange} autoComplete="email" required className="mt-1 p-2 border border-gray-300 dark:border-gray-700 block w-full shadow-sm sm:text-sm rounded-md text-gray-800 dark:text-gray-800" />
                                                </div>
                                                <div>
                                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                                    <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} autoComplete="current-password" required className="mt-1 p-2 border border-gray-300 dark:border-gray-700 block w-full shadow-sm sm:text-sm rounded-md text-gray-800 dark:text-gray-800" />
                                                </div>
                                                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:w-auto sm:text-sm">
                                                    Sign in
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={toggleModal} type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginModal;