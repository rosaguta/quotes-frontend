import React, { useState } from 'react';
import setcookie from "./Cookies";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'

const LoginModal = ({ isOpen, toggleModal, onLoginSuccess }) => {
    library.add(faEye, faEyeSlash);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data
        const userData = {
            username: uname,
            password: password
        };

        // Send POST request
        let response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/Auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            if (response.status === 401) {
               onLoginSuccess(false)
            } else {
                throw new Error('Network response was not ok');
            }
        } else {
            let jwt = await response.text();
            setcookie(jwt);
            onLoginSuccess(true)
            toggleModal();

            // Call the callback function with the user data
            ;
        }
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

                        <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full group bg-gradient-to-br p-1.5 from-purple-500 to-indigo-700 text-white">
                            <div className="bg-gray-950 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded">
                                <div className="">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-200" id="modal-title">
                                            Login bucko :3
                                        </h3>
                                        <div className="mt-2">
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                    <label htmlFor="text"
                                                        className="block text-sm font-medium text-gray-300">Username</label>
                                                    <input type="text" id="uname" name="uname" value={uname}
                                                        onChange={handleEmailChange} autoComplete="email" required
                                                        className="mt-1 p-2 border border-gray-700 block w-full shadow-sm sm:text-sm rounded-md text-gray-800" />
                                                </div>
                                                <div className="relative">
                                                    <label htmlFor="password"
                                                        className="block text-sm font-medium text-gray-300">Password</label>
                                                    <input type={showPassword ? "text" : "password"} id="password"
                                                        name="password"
                                                        value={password} onChange={handlePasswordChange}
                                                        autoComplete="current-password" required
                                                        className="mt-1 p-2 border border-gray-700 block w-full shadow-sm sm:text-sm rounded-md text-gray-800" />
                                                    <button type="button" onClick={togglePasswordVisibility}
                                                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-300 focus:outline-none">
                                                        {showPassword ? (
                                                            <span className="pt-6 pr-1 text-gray-900 items-center"> {<FontAwesomeIcon icon={"eye"} />}</span>
                                                        ) : (
                                                            <span className="pt-6 pr-1 text-gray-900 items-center"> {<FontAwesomeIcon icon={"eye-slash"} />}</span>
                                                        )}
                                                    </button>
                                                </div>
                                                <button type="submit"
                                                    className="border font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 border-purple-400 text-purple-400 hover:text-white hover:bg-purple-500 focus:ring-purple-900">
                                                    Sign in
                                                </button>
                                                <button onClick={toggleModal} type="button"
                                                    className="absolute right-5 border  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800">
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
