"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const HomePage = () => {
    const [quote, SetQuote] = useState(null);
    const [rizz, SetRizz] = useState(null)

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch(`https://quote.digitalindividuals.com/quotes/random`);
                const data = await response.text();
                SetQuote(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const fetchRizz = async () => {
            try {
                const response = await fetch(`https://quote.digitalindividuals.com/rizzes/random`);
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
            <div className="flex overflow-hidden min-h-screen items-stretch">
                <div
                    className="basis-1/2 grow overflow-hidden m-10 flex-1 items-center justify-center duration-300 hover:scale-105">
                    <div className="m-2">{quote}</div>
                    <Link href="/quotes">
                        <div className="transition ease-out h-full rounded p-10 bg-purple-950 hover:bg-indigo-950 hover:shadow-lg">
                            <p className="text-white m-2 text-xl font-bold">Quotes</p>
                        </div>
                    </Link>
                </div>

                <div
                    className="basis-1/2 grow overflow-hidden m-10 flex-1 items-center justify-center duration-300 hover:scale-105">
                    <div className="m-2">{rizz}</div>
                    <Link href="/rizz">
                        <div className="transition ease-out  h-full object-cover p-10 rounded bg-purple-950 hover:bg-indigo-950">
                            <p className="m-2 text-xl font-bold">Rizz</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
