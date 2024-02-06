'use client';
import React, { useState, useEffect } from 'react';

export default function Home() {
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
                              <button onClick={() => handleEditClick(index)}>Edit</button>
                              <button onClick={() => handleDeleteClick(index)}>Delete</button>
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
        {/* Modal for confirmation */}
        {deleteIndex !== null && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-5 rounded-md">
                <p>Are you sure you want to delete this quote?</p>
                <button onClick={handleConfirmDelete}>Yes</button>
                <button onClick={() => setDeleteIndex(null)}>No</button>
              </div>
            </div>
        )}
      </div>
  );
}
