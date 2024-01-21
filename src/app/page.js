'use client'
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/quote/all`);
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

  }, []);

  if (!jsonData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Text</th>
            <th>Person</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {jsonData.map((item, index) => (
            <tr key={index}>
              <td>{item.text}</td>
              <td>{item.person}</td>
              <td>{item.dateTimeCreated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
