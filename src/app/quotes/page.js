'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";

export default function Home() {
  const token = Cookies.get('token');
  const [jsonData, setJsonData] = useState(null);
  const [editableIndex, setEditableIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes`);
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (index) => {
    setEditableIndex(index);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
  };

  const handleSendClick= async (item)=>{
    console.log(item)
    const headerlist = {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin" : "no-cors"
    }
    let jsonbody = JSON.stringify(item)
    console.log(jsonbody)
    await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/${item.id}`,{
      headers: headerlist,
      method: 'PUT',
      body: jsonbody,
    }).then(response =>{
      if(!response.ok){
        if(response.status === 401){
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
        }else {
          throw new Error('Network response was not ok');
        }
      }else{
        toast.success("Quote edited ^-^",{position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"})
          setJsonData((prevData) => {
            const newData = [...prevData];
            newData[item.id] = item;
            return newData;
          });
      }
    });
    
  };

  const handleConfirmDelete = async () => {
    try {
      const idToDelete = jsonData[deleteIndex].id;
      const headerlist = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Authorization": `Bearer ${token}`,
        "Access-Control-Allow-Origin" : "no-cors"
      }

      // Assuming your server supports the DELETE request for deleting an item
      await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/${idToDelete}`, {
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
        }else{
          toast.success("Quote deleted",{position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"})
        }
      });
      // Remove the deleted item from the jsonData
      setJsonData((prevData) => prevData.filter((item, index) => index !== deleteIndex));

      // Clear the delete index after successful deletion
      setDeleteIndex(null);
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
        <div className=" overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y  divide-gray-700">
                <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase">Text</th>
                  <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase">Person</th>
                  <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase">Created Date</th>
                  <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                {jsonData.map((item, index) => (
                    <tr key={index} className={editableIndex === index ? "bg-gray-200 bg-gray-700" : "hover:bg-gray-700"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                        {editableIndex === index ? (
                            <textarea
                                type="text"
                                value={item.text}
                                onChange={(e) => {
                                  const editedItem = { ...item, text: e.target.value };
                                  setJsonData((prevData) => {
                                    const newData = [...prevData];
                                    newData[index] = editedItem;
                                    return newData;
                                  });
                                }}
                                className="bg-transparent text-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-purple-500 focus:outline-none resize rounded-md "
                            />
                        ) : (
                            <pre>{item.text}</pre>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {editableIndex === index ? (
                            <textarea
                                type="text"
                                value={item.person}
                                onChange={(e) => {
                                  const editedItem = { ...item, person: e.target.value };
                                  setJsonData((prevData) => {
                                    const newData = [...prevData];
                                    newData[index] = editedItem;
                                    return newData;
                                  });
                                }}
                                className="bg-transparent text-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-purple-500 focus:outline-none resize rounded-md "
                            />
                        ) : (
                            item.person
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {editableIndex === index ? (
                            <textarea
                                type="text"
                                value={item.dateTimeCreated}
                                onChange={(e) => {
                                  const editedItem = { ...item, dateTimeCreated: e.target.value };
                                  setJsonData((prevData) => {
                                    const newData = [...prevData];
                                    newData[index] = editedItem;
                                    return newData;
                                  });
                                }}
                                className="bg-transparent text-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-purple-500 focus:outline-none resize rounded-md "
                            />
                        ) : (
                            item.dateTimeCreated
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {editableIndex === index ? (
                            <>
                              <button className="hover:text-white border font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 border-purple-400 text-purple-400 hover:text-white hover:bg-purple-500"
                                  onClick={() => handleSendClick(item)}>Send</button>
                              <button
                                  className="hover:text-white border font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 "
                                  onClick={() => {
                                    // Revert changes and cancel editing
                                    setEditableIndex(null);
                                    
                                  }}
                              >
                                Cancel
                              </button>
                            </>
                        ) : (
                            <>
                              <button className="hover:text-white border font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 border-purple-400 text-purple-400 hover:text-white hover:bg-purple-500" onClick={() => handleEditClick(index)}>Edit</button>
                              <button className="hover:text-white border font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 border-red-500 text-red-500 hover:text-white hover:bg-red-600" onClick={() => handleDeleteClick(index)}>Delete</button>
                            </>
                        )}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {deleteIndex !== null && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
              <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full group bg-gradient-to-br p-1.5 from-red-500 to-pink-700 text-white">
                <div className="bg-gray-950 p-5 rounded-md">
                  <p className="pb-5">Are you sure you want to delete this quote?</p>
                  <button className="hover:text-white border font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 border-red-500 text-red-500 hover:text-white hover:bg-red-600" onClick={handleConfirmDelete}>Yes</button>
                  <button className="hover:text-white border font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 " onClick={() => setDeleteIndex(null)}>No</button>
                </div>
              </div>
            </div>
        )}
        <ToastContainer />
      </div>
  );
}
