"use client"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import AloneTimeChart from '../../../Components/AloneTimeChart'
export default function MostTimeALone() {
  const [lonerTimes, setLonerTimes] = useState([])
  const [token, setToken] = useState(Cookies.get('token'))
  const [isAuthed, setIsAuthed] = useState(false)
  const [apiResponse, setApiResponse] = useState([])
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
    getLonerTimes()
  }, [])
  if (!isAuthed) {
    return <div>you are unauthed</div>
  }
  return (
    <div className="p-4">
      <AloneTimeChart data={lonerTimes} />
    </div>
  )
}