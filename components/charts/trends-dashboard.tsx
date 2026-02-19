"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartPoint = { name?: string; date?: string; count: number };

type TrendsData = {
  timeSeries: ChartPoint[];
  sponsors: ChartPoint[];
  sectors: ChartPoint[];
  confidence: ChartPoint[];
};

export function TrendsDashboard({ data }: { data: TrendsData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card h-72"><p>Signals over time</p><ResponsiveContainer><LineChart data={data.timeSeries}><CartesianGrid stroke="#334155" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="count" stroke="#60a5fa" /></LineChart></ResponsiveContainer></div>
      <div className="card h-72"><p>Top sponsors</p><ResponsiveContainer><BarChart data={data.sponsors}><CartesianGrid stroke="#334155" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#818cf8" /></BarChart></ResponsiveContainer></div>
      <div className="card h-72"><p>Sector mix</p><ResponsiveContainer><PieChart><Pie data={data.sectors} dataKey="count" nameKey="name" fill="#34d399" label /><Tooltip /></PieChart></ResponsiveContainer></div>
      <div className="card h-72"><p>Confidence distribution</p><ResponsiveContainer><BarChart data={data.confidence}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#f59e0b" /></BarChart></ResponsiveContainer></div>
    </div>
  );
}
