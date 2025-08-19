"use client"
import { Card } from "@/components/ui/card"
import DarkCard from "@/components/ui/DarkCard"
import { GetColorWithOpacity } from "@/utils/Color"
import { useEffect, useState } from "react";
import {animate, stagger} from "animejs";

export default function QuestionScreen() {
    const [color, setColor] = useState("#8b50c7")
    
    useEffect(() => {
        animate('.main-card',{
            borderColor: ['#F27EBE', '#35BDF2', '#F2E74B', '#4CAF50', '#F27EBE'],
            duration: 5000,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            loop: true,
        });

        animate('.quote-text',{
            opacity: [0, 1],
            duration: 1500,
            delay: 500,
            easing: 'easeOutExpo',
        });

        animate('.answer-card',{
            scale: [0.8, 1],
            opacity: [0, 1],
            rotate: [10, 0],
            duration: 1000,
            delay: stagger(200, {start: 1000}), 
            easing: 'easeOutSine',
        });
    }, []);

    return (
        <div className="w-full p-2">
            <div className="flex justify-center w-full pb-2">
                <Card className={`px-4 flex flex-col justify-evenly items-center h-60 w-full font-terminal main-card`}>
                    <p className="text-zinc-400 quote-text">No way _____ said this:</p>
                    <p className="h-32 quote-text">Live in my walls? how about u live in my balls</p>
                </Card>
            </div>
            <div className="grid h-96 gap-2 grid-cols-2 place-items-center font-terminal">
                <DarkCard className="w-full h-full flex justify-center items-center border-[#F27EBE]/80 answer-card" direction="to_bottom_right" color="#F27EBE">Rose</DarkCard>
                <DarkCard className="w-full h-full flex justify-center items-center border-[#35BDF2]/80 answer-card" direction="to_bottom_left" color="#35BDF2">Liv</DarkCard>
                <DarkCard className="w-full h-full flex justify-center items-center border-[#F2E74B]/80 answer-card" direction="to_top_right" color="#F2E74B">Daan</DarkCard>
                <DarkCard className="w-full h-full flex justify-center items-center border-[#4CAF50]/80 answer-card" direction="to_top_left" color="#4CAF50">Vika</DarkCard>
            </div>
            <div className="md:hidden w-full flex justify-center">
                <div className="w-px bg-opacity-80 h-[95%] bg-white" />
            </div>
        </div>
    )
}