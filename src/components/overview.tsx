"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const generateChartData = () => [
  { name: "Jan", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Feb", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Mar", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Apr", score: Math.floor(Math.random() * 50) + 50 },
  { name: "May", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Jun", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Jul", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Aug", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Sep", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Oct", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Nov", score: Math.floor(Math.random() * 50) + 50 },
  { name: "Dec", score: Math.floor(Math.random() * 50) + 50 },
];


export function Overview() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(generateChartData());
  }, []);


  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
             cursor={{ fill: 'hsl(var(--accent))', radius: 'var(--radius)' }}
        />
        <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
