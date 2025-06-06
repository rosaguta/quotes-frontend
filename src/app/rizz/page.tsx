'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { columns, Quote } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import EditQuoteModal from "@/components/EditQuoteModal"
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import MasornyView from '@/components/MasornyView';
import { Button } from '@/components/ui/button';
import { CircleCheck, CircleMinus } from 'lucide-react';
import * as jose from 'jose'
export default function Home() {
  const { toast } = useToast()

  const [jsonData, setJsonData] = useState<Quote[] | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [jwtToken, setJwtToken] = useState<string>()
  const [rights, setRights] = useState<boolean>(false)

  useEffect(() => {
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
      const token = Cookies.get('token');
      const headers = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "no-cors",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/Rizzes`, { headers });
        let data = await response.json();

        data = data.map((quote) => ({
          ...quote,
          dateTimeCreated: formatDate(quote.dateTimeCreated),
        }));

        setJsonData(data);
        setJwtToken(token);
        const JWTClaims = jose.decodeJwt(token)

        const hasRights = JWTClaims.Rights === "True";
        setRights(hasRights);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (index) => {
    setQuoteToEdit(jsonData.find((el) => el.id == index)); 
    setEditModalOpen(true);
  };
  const handleSaveQuote = (updatedQuote) => {

    handleSendClick(updatedQuote)
  };
  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setDeleteAlertOpen(!deleteAlertOpen)

  };

  const handleSendClick = async (item: Quote) => {
    const headerlist = {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
      "Access-Control-Allow-Origin": "no-cors"
    }
    let jsonbody = JSON.stringify(item)
    await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/Rizzes/${item.id}`, {
      headers: headerlist,
      method: 'PUT',
      body: jsonbody,
    }).then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Rizz not edited",
            description: (
              <div className='flex place-items-center'>
                <CircleCheck className="p-0.5" color='#FF0000' />
                <p className="ml-2">Unauthorized</p>
              </div>
            ),
            duration: 3000,
          })
        }
        toast({
          title: "Rizz not edited",
          description: (
            <div className='flex place-items-center'>
              <CircleCheck className="p-0.5" color='#FF0000' />
              <p className="ml-2">check the values again</p>
            </div>
          ),
          duration: 3000,
        })
      } else {
        toast({
          title: "Rizz edited",
          description: (
            <div className='flex place-items-center'>
              <CircleCheck className="p-0.5" color='#00c000' />
              <p className="ml-2">Successfully edited</p>
            </div>
          ),
          duration: 3000,
        })
        setEditModalOpen(false);
        setJsonData((prevData) =>
          prevData.map((quote) =>
            quote.id === item.id ? item : quote
          )
        );
      }
    });

  };

  const handleConfirmDelete = async (id: string) => {
    try {
      const headerlist = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Authorization": `Bearer ${jwtToken}`,
        "Access-Control-Allow-Origin": "no-cors"
      }

      await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/Rizzes/${id}`, {
        headers: headerlist,
        method: 'DELETE',
      }).then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            toast({
              title: "Rizz not deleted",
              description: (
                <div className='flex place-items-center'>
                  <CircleMinus className="p-0.5" color='#FF0000' />
                  <p className="ml-2">Unsuccessfull deletion</p>
                </div>
              ),
              duration: 3000,
            })
          } else {
            throw new Error('Network response was not ok');
          }
        } else {
          toast({
            title: "Rizz deleted",
            description: (
              <div className='flex place-items-center'>
                <CircleCheck className="p-0.5" color='#00c000' />
                <p className="ml-2">Successfully deleted</p>
              </div>
            ),
            duration: 3000,
          })
          // Remove the deleted item from the jsonData
          console.log("jsonData is not yet set")
          setJsonData((prevData) => {
            if (!prevData) return prevData; // Safeguard
            return prevData.filter((item) => item.id !== id); 
          });
          console.log("jsonData is set")
        }
      });

    } catch (error) {
      console.error("Error deleting data:", error);
    }

  };
  if (!jsonData) {
    return <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 animate-spin">
          <div className="h-36 w-36 rounded-full bg-black"></div>
        </div>
      </div>
    </div>;
  }

  return (
    <div className='h-screen'>

      {editModalOpen && (

        <EditQuoteModal
          isOpen={editModalOpen}
          toggleModal={setEditModalOpen}
          Quote={quoteToEdit}
          onSave={handleSaveQuote}
        />
      )
      }

      <div className=" overflow-x-auto">
        <div className="p-5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            {rights ? (
              <DataTable columns={columns(handleEditClick, handleDeleteClick)} data={jsonData} />)
              :
              (

                <div className=''>
                  <div className="fixed inset-0 opacity-30 -z-20">
                    {[...Array(100)].map((_, i) => (
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
                  <MasornyView data={jsonData} color={"#fc03fc"} initColor={"#631663"} />

                </div>
              )}

          </div>
        </div>
      </div>
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?!?!?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This cannot be undone :c
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => handleConfirmDelete(deleteIndex)}>continue</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
}
