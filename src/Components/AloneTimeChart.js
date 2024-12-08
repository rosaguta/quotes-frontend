'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/ui/card';

const AloneTimeChart = ({ data }) => {
  // Parse the data if it's a string
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  // Calculate total alone time per user
  const userTotals = parsedData.reduce((acc, curr) => {
    const Uuid = curr.discordUuid;
    const userName = curr.discordUsername
    if (!acc[Uuid]) {
      acc[Uuid] = {
        username: userName,
        totalMinutes: 0
      };
    }
    // Convert milliseconds to minutes and add to total
    acc[Uuid].totalMinutes += curr.aloneInMillis / (1000 * 60);
    return acc;
  }, {});

  // Convert to array and round minutes
  const chartData = Object.values(userTotals).map(user => ({
    username: user.username,
    totalMinutes: Math.round(user.totalMinutes)
  }));
  console.log("chartData", chartData)
  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle>Total Time Alone Per User</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <XAxis 
              dataKey="username" 
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis dataKey="totalMinutes" label={{ value: 'Minutes Alone', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value) => [`${value} minutes`, 'Time Alone']}
            />
            <Bar 
              dataKey="totalMinutes" 
              fill="#4F46E5"
              name="Time Alone"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AloneTimeChart;