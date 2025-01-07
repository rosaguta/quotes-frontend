'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import * as jose from 'jose'
import { columns, Quote } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import EditQuoteModal from "@/components/EditQuoteModal"
export default function Home() {
  const token = Cookies.get('token');
  let claims = null
  if (token) {
    claims = jose.decodeJwt(token);
  }
  const [jsonData, setJsonData] = useState<Quote[] | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null)
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [originalItem, setOriginalItem] = useState(null);
  const [dummyState, setDummyState] = useState(0);
  useEffect(() => {

    const fetchData = async () => {
      try {
        const headerlist = {
          "Accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Access-Control-Allow-Origin": "no-cors"
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes`, { headers: headerlist, });
        const data: Quote[] = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (index) => {
    console.log("index:", index)
    console.log("quote:", jsonData.find((el)=>el.id == index))
    setQuoteToEdit(jsonData.find((el)=>el.id == index)); // Directly set the new quote to edit
    setEditModalOpen(true); // Ensure the modal opens
  };
  const handleSaveQuote = (updatedQuote) => {
    setJsonData((prevData) =>
      prevData.map((quote) =>
        quote.id === updatedQuote.id ? updatedQuote : quote
      )
    );
    setEditModalOpen(false);
  };
  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
  };

  const handleSendClick = async (item: Quote) => {
    const headerlist = {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
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
        "Authorization": `Bearer ${token}`,
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
    <div className="flex flex-col">
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
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <DataTable columns={columns(handleEditClick, handleConfirmDelete)} data={jsonData} />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
