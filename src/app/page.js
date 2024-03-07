"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import LoginModal from "../Components/LoginModal";
import { toast, ToastContainer } from "react-toastify";
import { SparklesCore } from "../Components/ui/sparkles";

const HomePage = () => {
    const [quote, setQuote] = useState("");
    const [rizz, setRizz] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/random`);
                const data = await response.text();
                setQuote(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchRizz = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/rizzes/random`);
                const data = await response.text();
                setRizz(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchQuote();
        fetchRizz();
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleLoginSuccess = (bool) => {
        if (bool) {
            toast.success("Login successful", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            console.log("User logged in successfully:", bool);
        } else {
            toast.error("wrong credentials lol", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        }

    };

    return (
        <div>
            <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={25}
                className="w-full h-full absolute"
                particleColor="#FFFFFF"
            />
            <div>
                <div className="h-screen pt-5 overflow-hidden">
                    <div className="flex flex-col items-center">
                        <LoginModal isOpen={isModalOpen} toggleModal={toggleModal} onLoginSuccess={handleLoginSuccess} />
                        <button onClick={toggleModal} className="relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white text-white focus:outline-none focus:ring-cyan-800">
                            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">Want to edit something?</span>
                        </button>

                    </div>
                    <div className="flex overflow-hidden h-5/6 items-stretch ">
                        <div
                            className="basis-1/2 grow overflow-hidden m-10 flex-1 items-center justify-center duration-300 hover:scale-105 ">
                            <div className="m-2 italic">{quote}</div>
                            <Link href="/quotes">
                                <button className="relative inline-flex items-center justify-center h-5/6 w-full p-1 mb-2 me-2 overflow-hidden font-bold text-6xl rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:outline-none focus:ring-blue-800">
                                    <span className="relative items-center inline-flex justify-center py-3 transition-all ease-in duration-75 h-full w-full bg-gray-950 rounded-md group-hover:bg-opacity-0">Quotes</span>
                                </button>
                            </Link>
                        </div>

                        <div
                            className="basis-1/2 grow overflow-hidden m-10 flex-1 items-center justify-center duration-300 hover:scale-105">
                            <div className="m-2 italic">{rizz}</div>
                            <Link href="/rizz">
                                <button className="relative inline-flex items-center justify-center h-5/6 w-full p-1 mb-2 me-2 overflow-hidden font-bold text-6xl rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white text-white focus:outline-none focus:ring-purple-800 ">
                                    <span className="relative items-center inline-flex justify-center py-3 transition-all ease-in duration-75 h-full w-full bg-gray-950 rounded-md group-hover:bg-opacity-0">Rizz</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default HomePage;
