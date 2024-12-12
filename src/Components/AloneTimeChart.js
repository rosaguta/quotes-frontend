'use client'

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/ui/card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AloneTimeChart = ({ data }) => {
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

  // Prepare data for Chart.js
  const chartData = {
    labels: Object.values(userTotals).map(user => user.username),
    datasets: [
      {
        label: 'Minutes Alone',
        data: Object.values(userTotals).map(user => Math.round(user.totalMinutes)),
        backgroundColor: 'rgba(79, 70, 229, 0.8)', // Indigo color matching previous example
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
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
          text: 'Minutes Alone'
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <Card className="w-full">
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