"use client"
import Link from 'next/link';
import React, {useState, useEffect} from 'react';
// import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const HomePage = () => {
    const [quote, SetQuote] = useState("");
    const [rizz, SetRizz] = useState("")

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/random`);
                const data = await response.text();
                SetQuote(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const fetchRizz = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/rizzes/random`);
                const data = await response.text();
                SetRizz(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchQuote();
        fetchRizz();
    }, []);

    return (
        <div>
            <div className="flex overflow-hidden h-screen items-stretch">
                <div
                    className="basis-1/2 grow overflow-hidden m-10 flex-1 items-center justify-center duration-300 hover:scale-105 ">
                    <div className="m-2">{quote}</div>
                    <Link href="/quotes">
                        <div
                            className="transition ease-out h-5/6 object-cover p-10 rounded-2xl bg-purple-950 hover:bg-indigo-950 ">
                            <p className="text-white m-2 text-4xl font-bold ">Quotes</p>
                        </div>
                    </Link>
                </div>

                <div className="basis-1/2 grow overflow-hidden m-10 flex-1 items-center justify-center duration-300 hover:scale-105 ">
                    <div className="m-2">{rizz}</div>
                    <Link href="/rizz">
                        <div
                            className="transition ease-out h-5/6 object-cover p-10 rounded-2xl bg-purple-950 hover:bg-indigo-950">
                            <p className="text-white m-2 text-4xl font-bold">Rizz</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
        ;
};

export default HomePage;
