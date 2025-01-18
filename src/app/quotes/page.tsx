'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import * as jose from 'jose'
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
import { SparklesCore } from '@/components/ui/sparkles';
import { Button } from '@/components/ui/button';
export default function Home() {
  // const token = Cookies.get('token');
  // let claims = null
  // if (token) {
  //   claims = jose.decodeJwt(token);
  // }
  const [jsonData, setJsonData] = useState<Quote[] | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [originalItem, setOriginalItem] = useState(null);
  const [dummyState, setDummyState] = useState(0);
  const [jwtToken, setJwtToken] = useState<string>()
  const [particleSettings, setParticleSettings] = useState({
    minSize: 0.5,
    maxSize: 2,
    particleDensity: 25
  });

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/Quotes`, { headers });
        let data = await response.json();

        // Convert dates after fetching
        data = data.map((quote) => ({
          ...quote,
          dateTimeCreated: formatDate(quote.dateTimeCreated),
        }));

        setJsonData(data);
        setJwtToken(token);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (index) => {
    setQuoteToEdit(jsonData.find((el) => el.id == index)); // Directly set the new quote to edit
    setEditModalOpen(true); // Ensure the modal opens
  };
  const handleSaveQuote = (updatedQuote) => {
    setJsonData((prevData) =>
      prevData.map((quote) =>
        quote.id === updatedQuote.id ? updatedQuote : quote
      )
    );
    setEditModalOpen(false);
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
    await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/${item.id}`, {
      headers: headerlist,
      method: 'PUT',
      body: jsonbody,
    }).then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Unauthorized: You are not authorized to perform this action.', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
          })
        } else {
          throw new Error('Network response was not ok');
        }
      } else {
        toast.success("Quote edited ^-^", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        })
        setEditModalOpen(false);
        setJsonData((prevData) => {
          const newData = [...prevData];
          newData[item.id] = item;
          return newData;
        });
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

      // Assuming your server supports the DELETE request for deleting an item
      await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/${id}`, {
        headers: headerlist,
        method: 'DELETE',
      }).then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Unauthorized: You are not authorized to perform this action.', {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark"
            })
          } else {
            throw new Error('Network response was not ok');
          }
        } else {
          toast.success("Quote deleted", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
          })
          // Remove the deleted item from the jsonData
          console.log("jsonData is not yet set")
          setJsonData((prevData) => {
            if (!prevData) return prevData; // Safeguard
            return prevData.filter((item) => item.id !== id); // Use the `id` instead of `deleteIndex`
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
            {jwtToken ? (
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
                  <MasornyView data={jsonData} color={"#9803fc"} />

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
              <Button onClick={()=>handleConfirmDelete(deleteIndex)}>continue</Button>
              </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ToastContainer />
    </div>
  );
}
