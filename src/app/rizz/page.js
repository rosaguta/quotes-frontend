'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'

export default function Home() {
  const [jsonData, setJsonData] = useState(null);
  const [editableIndex, setEditableIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/rizzes`);
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

  const handleSendClick = async (editedItem) => {
    console.log(JSON.stringify(editedItem))
    try {
      // Assuming your server supports the PUT request for updating an item
      await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/rizzes/${editedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedItem),
      });

      // Clear the editable index after successfully sending the edit
      setEditableIndex(null);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  if (!jsonData) {
    return <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex min-h-screen w-full items-center justify-center">
        <div
            className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 animate-spin">
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
              <table className="min-w-full divide-y divide-gray-200 divide-gray-700">
                <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Text</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Person</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Created Date</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                        // item.text
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
                        <button onClick={() => handleEditClick(index)}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
// dit is een comment