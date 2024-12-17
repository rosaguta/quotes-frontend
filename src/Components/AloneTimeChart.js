'use client'

import React, { useRef, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/ui/card';
import "chartjs-plugin-datalabels"
import ChartDataLabels from 'chartjs-plugin-datalabels';
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const AloneTimeChart = ({ data, toImage }) => {
  const chartRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  // Parse the data if it's a string
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  // Calculate total alone time per user
  const userTotals = parsedData.reduce((acc, curr) => {
    const userName = curr.discordUsername;
    if (!acc[userName]) {
      acc[userName] = {
        username: userName,
        totalMinutes: 0
      };
    }
    // Convert milliseconds to minutes and add to total
    acc[userName].totalMinutes += curr.aloneInMillis / (1000 * 60);
    return acc;
  }, {});
  // sort descending by minutes
  const sortedUsers = Object.values(userTotals).sort((a, b) => b.totalMinutes - a.totalMinutes);
  // Prepare data for Chart.js
  const chartData = {
    labels: Object.values(sortedUsers).map(user => user.username),
    datasets: [
      {
        label: 'Minutes Alone',
        data: Object.values(sortedUsers).map(user => Math.round(user.totalMinutes)),
        backgroundColor: 'rgba(79, 70, 229, 0.8)', // Indigo color matching previous example
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };
  const options = {
    animation: {
      duration: 0
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        align: 'top',
        anchor: 'start',
        color: 'white',
        font: {
          weight: 'bold'
        },
        formatter: function (value, context) {
          return value + " minutes"
        }

      },
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: true,
        text: "Total Time Alone Per User",
        color: 'white',
        font: {
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${Math.round(context.raw)} minutes`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes Alone',
          color: "#ffffff"
        },
        ticks: {
          color: '#ffffff', // Set Y-axis text color (e.g., Tailwind gray-800)
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          color: '#ffffff',
        }
      }
    },

  };

  useEffect(() => {
    if (toImage) {
      // Create an offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = 800;  // Set desired width
      canvas.height = 400; // Set desired height

      // Create a new Chart instance on the offscreen canvas
      const ctx = canvas.getContext('2d');
      const chart = new ChartJS(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          ...options,
          // Override any responsive options for fixed size
          responsive: false,
          maintainAspectRatio: false,
        }
      });

      // Convert to image immediately
      const imageUrl = canvas.toDataURL('image/png');
      setImageUrl(imageUrl);

      // Clean up
      chart.destroy();
    }
  }, [toImage]);

  if (toImage && imageUrl) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'lonerChartImage.png';
    link.click();
    return (
      <div></div>
    );
  }

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Total Time Alone Per User</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};
export default AloneTimeChart;