'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'

export default function Home() {
  const token = Cookies.get('Token');
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

  const handleConfirmDelete = async () => {
    try {
      const idToDelete = jsonData[deleteIndex].id;

      // Assuming your server supports the DELETE request for deleting an item
      await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/${idToDelete}`, {
        method: 'DELETE',
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
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Text</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Person</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Created Date</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {jsonData.map((item, index) => (
                    <tr key={index} className={editableIndex === index ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
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
                                className="bg-transparent text-gray-800 dark:text-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-purple-500 focus:outline-none resize rounded-md "
                            />
                        ) : (
                            <pre>{item.text}</pre>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
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
                                className="bg-transparent text-gray-800 dark:text-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-purple-500 focus:outline-none resize rounded-md "
                            />
                        ) : (
                            item.person
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
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
                                className="bg-transparent text-gray-800 dark:text-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-purple-500 focus:outline-none resize rounded-md "
                            />
                        ) : (
                            item.dateTimeCreated
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {editableIndex === index ? (
                            <>
                              <button onClick={() => handleSendClick(item)}>Send</button>
                              <button
                                  onClick={() => {
                                    // Revert changes and cancel editing
                                    setEditableIndex(null);
                                    setJsonData((prevData) => {
                                      const newData = [...prevData];
                                      newData[index] = item;
                                      return newData;
                                    });
                                  }}
                              >
                                Cancel
                              </button>
                            </>
                        ) : (
                            <>
                              <button className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-1 mb-1 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900" onClick={() => handleEditClick(index)}>Edit</button>
                              <button className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 text-center me-1 mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900" onClick={() => handleDeleteClick(index)}>Delete</button>
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
              <div className="bg-gray-950 p-5 rounded-md">
                <p className="pb-5">Are you sure you want to delete this quote?</p>
                <button className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900" onClick={handleConfirmDelete}>Yes</button>
                <button className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" onClick={() => setDeleteIndex(null)}>No</button>
              </div>
            </div>
        )}
      </div>
  );
}
