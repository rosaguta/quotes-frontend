"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DotPattern from "@/components/ui/DotPattern"
import Image from "next/image"
import { cn } from '@/lib/utils'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Info, CircleCheck, LoaderCircle } from 'lucide-react';
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Setcookie from "@/components/Cookies"
import * as jose from 'jose'
import { GetColor } from "@/utils/Color"
import { useEffect } from "react"
type Credentials = {
  username: string
  password: string
}
export default function Login() {
  const [loginCredentials, setLoginCredentials] = useState<Credentials>({
    username: "",
    password: ""
  })
  const [color, setColor] = useState("#000000");
  const freq = 0.1;
  let i = 0;

  useEffect(() => {
    const interval = setInterval(() => {
        const newColor = GetColor(freq, i);
        setColor(newColor);
        i++;
    }, 100);

    return () => clearInterval(interval); // cleanup
}, []);
  const router = useRouter()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { toast } = useToast()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const handleInputChange = (field: keyof Credentials, value: string) => {
    setLoginCredentials((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedTerms) {
      toast({
        title: "Terms & Conditions",
        description: (
          <div className='flex place-items-center'>
            <Info className="p-0.5" color='#FFFFFF' />
            <p className="ml-2">You need to accept the Terms and Conditions</p>
          </div>
        ),
        duration: 3000,
      })
      return
    }
    const header = { "content-type": "application/json" }
    setIsLoggingIn(true)
    await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/auth`, {
      headers: header,
      method: "POST",
      body: JSON.stringify(loginCredentials)
    }).then(async response => {
      if (!response.ok) {
        if (response.status === 401) {
          setIsLoggingIn(false)
          toast({
            title: "Unauthorized",
            description: (
              <div className='flex place-items-center'>
                <CircleCheck className="p-0.5" color='#FF0000' />
                <p className="ml-2">Invalid Credentials</p>
              </div>
            ),
            duration: 3000,
          })
        }
      } else {
        setIsLoggingIn(false)
        let jwt = await response.text();
        const claims = jose.decodeJwt(jwt);
        const rfc2822 = new Date(claims.exp * 1000).toUTCString();
        Setcookie(jwt, rfc2822)
        router.push("/")
      }
    });
  }

  return (
    <div
      className="w-screen h-screen relative overflow-hidden ">
      <DotPattern
        width={12}
        height={12}
        cx={1.5}
        cy={1.5}
        cr={1.5}
        className={cn(
          "absolute inset-0 z-[-1] [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}
        style={{
          fill: color,
          transition: "fill 0.2s ease-in-out",
        }}
      />
      <form
        onSubmit={handleSubmit}
        className="p-5 w-full h-full grid place-items-center"
      >
        <motion.div className="grid md:grid-cols-[1fr_1px_1fr] h-full items-center gap-40"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
            hidden: {},
          }}
        >
          <motion.div
            variants={itemVariants}
            className="hidden md:flex justify-center items-center h-full">
            <Image
              alt="quote"
              src="/quote.svg"
              width={200}
              height={200}
              className="object-contain"
            />
          </motion.div>

          <div className="hidden md:block w-px bg-opacity-80 h-[95%] bg-white" />

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 w-full max-w-xs">
            <h1 className="text-xl font-bold">Login</h1>

            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={loginCredentials.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              required
            />

            <Label htmlFor="password">Password</Label>
            <Input
              className=""
              id="password"
              type="password"
              value={loginCredentials.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />

            <div className="items-top flex space-x-2">
              <Checkbox
                id="terms1"
                checked={acceptedTerms}
                onCheckedChange={(value) => setAcceptedTerms(Boolean(value))}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
                <p className="text-sm text-muted-foreground">
                  You agree with being absolutely mutelated by the nonsense on this website
                </p>
              </div>
            </div>
            {isLoggingIn ? (
                <Button disabled><LoaderCircle className="animate-spin bg-transparent" /></Button>
            ) : (
              <Button type="submit">Login</Button>
            )}
          </motion.div>
        </motion.div>
      </form >
      <Toaster />
    </div >
  )
}
