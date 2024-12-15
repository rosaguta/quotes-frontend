"use client"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import AloneTimeChart from '../../../Components/AloneTimeChart'
import { useSearchParams } from 'next/navigation'
import satori from "satori"
import { elements } from "chart.js"
import { width } from "@fortawesome/free-solid-svg-icons/fa0"

export default function MostTimeALone() {
  const searchParams = useSearchParams()
  const [lonerTimes, setLonerTimes] = useState([])
  const [token, setToken] = useState(Cookies.get('token'))
  const [isAuthed, setIsAuthed] = useState(false)
  const [apiResponse, setApiResponse] = useState([])
  const [imageElement, setImageElement] = useState("image not generated")
  const [fonts, setFonts] = useState()
  const imageparam = searchParams.get("image")
  useEffect(() => {

    const getLonerTimes = async () => {
      const headerlist = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Access-Control-Allow-Origin": "no-cors"
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/LonerTime`, { headers: headerlist })
        const hahaLoners = await response.json();
        setApiResponse(response)
        setLonerTimes(hahaLoners)
        setIsAuthed(true)
      } catch {
        if (apiResponse.status !== 200) {
          setIsAuthed(false)
        }
      }
    }
    const generateImage = async () => {
      try {
        const fonts = [
          {
            name: "Arial",
            data: await fetch("/JetBrainsMonoNerdFont-Medium.ttf").then((res) => res.arrayBuffer()),
            weight: 400,
            style: "normal",
          },
        ]
        const image = await satori(<AloneTimeChart data={lonerTimes} />, { width: 800, height: 800, fonts })
        setImageElement(image)
      } catch (error) {
        console.error(error)
      }

    }


    getLonerTimes()
    generateImage()
    setFonts()
  }, [])


  // if (!isAuthed) {
  //   return <div>you are unauthed</div>
  // }

  if (imageparam) {
    if (imageElement) {
      // console.log(imageElement)
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: imageElement || "Image is being generated...",
          }}
        ></div>
      )
    }
  }

  return (
    <div className="p-4">
      <AloneTimeChart data={lonerTimes} />
    </div>
  )
}