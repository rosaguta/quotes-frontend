"use client"
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import LoginModal from "../Components/LoginModal";
import { toast, ToastContainer } from "react-toastify";
import { SparklesCore } from "../Components/ui/sparkles";

const HomePage = () => {
    const [quote, setQuote] = useState("");
    const [rizz, setRizz] = useState("");
    const [insult, setInsult] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [particleSettingsOpen, setParticleSettingsOpen] = useState(false);
    const [particleSettings, setParticleSettings] = useState({
        minSize: 1,
        maxSize: 1.5,
        particleDensity: 50
    });
    const [coolModeActivated, setCoolMode] = useState(false)
    let buttonstring = ""
    const CoolWords = ["shark", "trans", "pride"];
    const findCoolWord = (str) => {
        for (const word of CoolWords) {
            if (str.includes(word)) {
                return true
            }
        }
    }
    const handleKeydown = (event) => {
        let Key = event.key
        let key = Key.toLocaleLowerCase()
        buttonstring = buttonstring.concat(key)
        if ((findCoolWord(buttonstring))) {
            setCoolMode(true)
            buttonstring = ""
        }
    }

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
        const fetchInsult = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/insults/random`);
                const data = await response.text();
                setInsult(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchQuote();
        fetchRizz();
        fetchInsult();
        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };

    }, []);


    const toggleParticleSettings = () => {
        setParticleSettingsOpen(!particleSettingsOpen);
    };

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
    const handleParticleSettingsChange = (event) => {
        const setting = event.split(',')
        setParticleSettings({
            ...particleSettings,
            [setting[0]]: parseFloat(setting[1]) // Convert value to float
        });
    };

    let flexmode = "relative"

    return (

        <div className={coolModeActivated === true ? flexmode : ''}>
            {!coolModeActivated ? (

                <SparklesCore
                    {...particleSettings}
                    background="transparent"
                    className="w-full h-full absolute"
                    particleColor='#FFFFFF'
                />
            ) : (
                <SparklesCore
                    {...particleSettings}
                    background="transparent"
                    className="w-full h-full absolute"
                />
            )}
            <div className='md:block hidden'>
                <div className="fixed bottom-5 left-5 rounded-lg bg-black">
                    <button onClick={toggleParticleSettings} className="relative inline-flex items-center justify-center bg-black p-0 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white text-white focus:outline-none focus:ring-cyan-800">
                        <img src="cog.svg" alt="cog lol" width={25} height={25} className='transition-all ease-in duration-75 bg-black group-hover:bg-opacity-0'></img>
                    </button>
                </div>
            </div>
            {particleSettingsOpen && (
                <div className="fixed bottom-5 left-20 bg-black p-4 border rounded shadow-lg flex">
                    <h2 className="text-lg font-bold mb-2 mr-10">Particle Settings</h2>
                    <div className="mb-2">
                        <label className="block text-gray-300 text-sm font-bold mb-1">Min Size</label>
                        <input
                            type="number"
                            value={particleSettings.minSize}
                            onChange={(e) => handleParticleSettingsChange('minSize,' + parseFloat(e.target.value))}
                            className="border rounded w-full py-1 px-2 bg-black focus:border-purple-500 "
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-300 text-sm font-bold mb-1">Max Size</label>
                        <input
                            type="number"
                            value={particleSettings.maxSize}
                            onChange={(e) => handleParticleSettingsChange('maxSize,' + parseFloat(e.target.value))}
                            className="border rounded w-full py-1 px-2 bg-black focus:border-purple-500 "
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-300 text-sm font-bold mb-1">Particle Density</label>
                        <input
                            type="number"
                            value={particleSettings.particleDensity}
                            onChange={(e) => handleParticleSettingsChange('particleDensity,' + parseFloat(e.target.value))}
                            className="border rounded w-full py-1 px-2 bg-black focus:border-purple-500 "
                        />
                    </div>
                </div>
            )}
            <div>
                <div className='md:block hidden'>
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
                                <div className="m-2 italic text-lg">{quote}</div>
                                <Link href="/quotes">
                                    <button className="relative inline-flex items-center justify-center h-5/6 w-full p-1 mb-2 me-2 overflow-hidden font-bold text-6xl rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:outline-none focus:ring-blue-800">
                                        <span className="relative items-center inline-flex justify-center py-3 transition-all ease-in duration-75 h-full w-full bg-gray-950 rounded-md group-hover:bg-opacity-0">Quotes</span>
                                    </button>
                                </Link>
                            </div>
                            <div className="basis-1/2 grow overflow-hidden m-10 flex-1 items-center justify-center duration-300 hover:scale-105">
                                <div className="m-2 italic text-lg">{rizz}</div>
                                <Link href="/rizz">
                                    <button className="relative inline-flex items-center justify-center h-5/6 w-full p-1 mb-2 me-2 overflow-hidden font-bold text-6xl rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white text-white focus:outline-none focus:ring-purple-800 ">
                                        <span className="relative items-center inline-flex justify-center py-3 transition-all ease-in duration-75 h-full w-full bg-gray-950 rounded-md group-hover:bg-opacity-0">Rizz</span>
                                    </button>
                                </Link>
                            </div>
                            <div className="basis-1/2 grow overflow-hidden m-10 flex-1 items-center justify-center duration-300 hover:scale-105">
                                <div className="m-2 italic text-lg">{insult}</div>
                                <Link href="/insults">
                                    <button className="relative inline-flex items-center justify-center h-5/6 w-full p-1 mb-2 me-2 overflow-hidden font-bold text-6xl rounded-lg group bg-gradient-to-br from-red-500 to-rose-500 group-hover:from-red-500 group-hover:to-rose-500 hover:text-white text-white focus:outline-none focus:ring-purple-800 ">
                                        <span className="relative items-center inline-flex justify-center py-3 transition-all ease-in duration-75 h-full w-full bg-gray-950 rounded-md group-hover:bg-opacity-0">insults</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='md:hidden block'>
                    <div>
                        <div className="h-screen pt-5 overflow-hidden">
                            <div className="flex flex-col items-center">
                                <LoginModal isOpen={isModalOpen} toggleModal={toggleModal} onLoginSuccess={handleLoginSuccess} />
                                <button onClick={toggleModal} className="relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white text-white focus:outline-none focus:ring-cyan-800">
                                    <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">Want to edit something?</span>
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row overflow-hidden h-5/6 items-stretch">
                                <div className="basis-full md:basis-1/2 grow overflow-hidden m-4 flex-1 items-center justify-center duration-300 hover:scale-105">
                                    <div className="m-2 italic text-lg">{quote}</div>
                                    <Link href="/quotes">
                                        <button className="relative inline-flex items-center justify-center h-auto w-full p-2 md:p-1 font-bold text-4xl md:text-6xl rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:outline-none focus:ring-blue-800">
                                            <span className="relative items-center inline-flex justify-center py-3 transition-all ease-in duration-75 h-full w-full bg-gray-950 rounded-md group-hover:bg-opacity-0">Quotes</span>
                                        </button>
                                    </Link>
                                </div>

                                <div className="basis-full md:basis-1/2 grow overflow-hidden m-4 flex-1 items-center justify-center duration-300 hover:scale-105">
                                    <div className="m-2 italic text-lg">{rizz}</div>
                                    <Link href="/rizz">
                                        <button className="relative inline-flex items-center justify-center h-auto w-full p-2 md:p-1 font-bold text-4xl md:text-6xl rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white text-white focus:outline-none focus:ring-purple-800">
                                            <span className="relative items-center inline-flex justify-center py-3 transition-all ease-in duration-75 h-full w-full bg-gray-950 rounded-md group-hover:bg-opacity-0">Rizz</span>
                                        </button>
                                    </Link>
                                </div>

                                <div className="basis-full md:basis-1/2 grow overflow-hidden m-4 flex-1 items-center justify-center duration-300 hover:scale-105">
                                    <div className="m-2 italic text-lg">{insult}</div>
                                    <Link href="/insults">
                                        <button className="relative inline-flex items-center justify-center h-auto w-full p-2 md:p-1 font-bold text-4xl md:text-6xl rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white text-white focus:outline-none focus:ring-purple-800">
                                            <span className="relative items-center inline-flex justify-center py-3 transition-all ease-in duration-75 h-full w-full bg-gray-950 rounded-md group-hover:bg-opacity-0">Insults</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default HomePage;
