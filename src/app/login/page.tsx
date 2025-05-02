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
import { Info } from 'lucide-react';
import { motion, animate, stagger } from "framer-motion"
type Credentials = {
  username: string
  password: string
}
export default function Login() {
  const [loginCredentials, setLoginCredentials] = useState<Credentials>({
    username: "",
    password: ""
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { toast } = useToast()
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
  const handleSubmit = (e: React.FormEvent) => {
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

    console.log("Logging in with:", loginCredentials)
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
          fill: '#6d28d9',
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

            <Button type="submit">Login</Button>
          </motion.div>
        </motion.div>
      </form >
      <Toaster />
    </div >
  )
}
