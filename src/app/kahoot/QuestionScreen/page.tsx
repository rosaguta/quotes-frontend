"use client"
import { Card } from "@/components/ui/card"
import DarkCard from "@/components/ui/DarkCard"
import { GetColorWithOpacity } from "@/utils/Color"
import { useEffect, useState } from "react";
export default function QuestionScreen() {
    const [color, setColor] = useState("#555555")
    let i = 0
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       const newColor = GetColorWithOpacity(0.1, i, 0.5);
    //       setColor(newColor)
    //       i++
    //     }, 500);
    
    //     return () => clearInterval(interval);
    //   }, []);

    return (
        <div className=" w-full p-2">
            <div className="flex justify-center w-full pb-2">
                <Card className={`px-4 flex flex-col justify-evenly items-center h-60 w-full font-terminal`} style={{borderColor:color}}>
                    <p className="text-zinc-400 " >No way ___ said this:</p>
                    <p className="h-32">Live in my walls? how about u live in my balls</p>
                </Card>
            </div>
            <div className="grid h-96 gap-2 grid-cols-2 place-items-center">
                <DarkCard className="w-full h-full flex justify-center items-center border-[#F27EBE]/80" direction="to_bottom_right" color="#F27EBE">Rose</DarkCard>
                <DarkCard className="w-full h-full flex justify-center items-center border-[#35BDF2]/80" direction="to_bottom_left" color="#35BDF2">Liv</DarkCard>
                <DarkCard className="w-full h-full flex justify-center items-center border-[#F2E74B]/80" direction="to_top_right" color="#F2E74B">Daan</DarkCard>
                <DarkCard className="w-full h-full flex justify-center items-center border-[#4CAF50]/80" direction="to_top_left" color="#4CAF50">Vika</DarkCard>
            </div>
            <div className=" w-full flex justify-center">
                <div className="w-px bg-opacity-80 h-[95%] bg-white" />
            </div>
        </div>
    )
}