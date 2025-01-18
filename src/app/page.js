"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SparklesCore } from '@/components/ui/sparkles';
import { User, CircleCheck, CircleMinus, UserMinus } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import LoginModal from '@/components/LoginModal';
import DarkCard from '@/components/ui/DarkCard';
import Cookies from 'js-cookie'
import LogoutModal from '@/components/Logoutmodal';
const HomePage = () => {
  const { toast } = useToast()
  const [quote, setQuote] = useState(null)
  const [rizz, setRizz] = useState(null)
  const [insult, setInsult] = useState(null)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [jwtToken, setJwtToken] = useState(null)
  const [particleSettings, setParticleSettings] = useState({
    minSize: 0.5,
    maxSize: 2,
    particleDensity: 25
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
    const token = Cookies.get('token');
    setJwtToken(token)
    const formatDate = (isoString) => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    const fetchData = async () => {
      const fetchEndpoint = async (endpoint) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/${endpoint}/random?asObject=true`)
        return await response.json()
      }
      const [fetchedQuote, fetchedRizz, fetchedInsult] = await Promise.all([
        fetchEndpoint("quotes"),
        fetchEndpoint("rizzes"),
        fetchEndpoint("insults")
      ]);

      fetchedQuote.dateTimeCreated = formatDate(fetchedQuote.dateTimeCreated)
      fetchedRizz.dateTimeCreated = formatDate(fetchedRizz.dateTimeCreated)
      fetchedInsult.dateTimeCreated = formatDate(fetchedInsult.dateTimeCreated)

      setQuote(fetchedQuote)
      setRizz(fetchedRizz)
      setInsult(fetchedInsult)
    }

    fetchData()
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };

  }, [])
  const handleUserClick = () => {
    setLoginModalOpen(!loginModalOpen)
    handleLoginState()
  }
  const handleUserLogoutClick=()=>{
    setLogoutModalOpen(!logoutModalOpen)
    handleLoginState()
  }
  const sections = [
    {
      title: 'Quotes',
      ...quote,
      href: '/quotes',
      color: "#9803fc"
    },
    {
      title: 'Rizz',
      ...rizz,
      href: '/rizz',
      color: "#fc03fc"
    },
    {
      title: 'Insults',
      ...insult,
      href: '/insults',
      color: "#ff0000"
    }
  ];
  const handleLoginState=()=>{
    setJwtToken(Cookies.get("token"))
  }
  const onLoginSuccess = (loginSucceeded) => {
    if (loginSucceeded) {
      toast({
        title: (<div className='flex place-items-center'>
          <CircleCheck className="p-0.5" color='#00c000' /><p>&nbsp; Access granted</p>
        </div>), duration: 3000,
      })
    } else {
      toast({
        title: (<div className='flex items-center'>
          <CircleMinus className="p-0.5" color='#c00000' /><p>&nbsp; Access denied</p>
        </div>), duration: 3000,
      })
    }
  }
  return (
    <div>
      {!coolModeActivated ? (

        <div className="fixed inset-0 opacity-30 -z-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[4px] h-[4px] bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      ) : (
        <SparklesCore
          {...particleSettings}
          background="transparent"
          className="w-full h-full absolute"
        />
      )}
      {!jwtToken ? (
        <User onClick={handleUserClick} className='md:block hidden absolute top-4 right-4 hover:cursor-pointer' > </User>
      ) : (
        <UserMinus onClick={handleUserLogoutClick} className="md:block hidden absolute top-4 right-4 hover:cursor-pointer" />
      )}
      <LoginModal isOpen={loginModalOpen} toggleModal={handleUserClick} onLoginSuccess={onLoginSuccess}></LoginModal>
      <LogoutModal isOpen={logoutModalOpen} toggleModal={handleUserLogoutClick} />
      <div className="p-12">

        <div className=" flex items-center justify-center">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {sections.map((section) => (
              <DarkCard key={section.title} color={section.color} borderColor={section.color}>
                <div className='relative select-none'>
                  <Link href={section.href}>
                    <div className="flex items-center justify-between mb-4 ">
                      <h2 className="text-2xl min-w-72 font-bold text-white">{section.title}</h2>
                      {section.icon}
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">
                        {section.person} - {section.dateTimeCreated}
                      </p>
                      <p className="text-gray-300">{section.text}</p>
                    </div>
                  </Link>
                </div>
              </DarkCard>
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default HomePage;