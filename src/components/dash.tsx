"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, RadarChart, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Moon, Sun, RefreshCcw, DollarSign, TrendingUp, Users, PieChart as PieChartIcon } from 'lucide-react';
import { motion } from "framer-motion";

export default function XRevenueDashboard() {
  const [currentPage, setCurrentPage] = useState('収益概要');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ダミーデータ
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
  ];

  const engagementData = [
    { name: 'ツイート', value: 400 },
    { name: 'リツイート', value: 300 },
    { name: 'いいね', value: 300 },
    { name: 'リプライ', value: 200 },
  ];

  const pages = ['収益概要', '広告パフォーマンス', 'ユーザーエンゲージメント', '財務予測'];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );

  const RevenueOverview = () => (
    <PageWrapper>
      <h2 className="text-2xl font-bold mb-4">収益概要</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>総収益トレンド</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>月次目標達成率</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={75} className="w-full" />
            <p className="mt-2 text-center">75% 達成</p>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );

  const AdPerformance = () => (
    <PageWrapper>
      <h2 className="text-2xl font-bold mb-4">広告パフォーマンス</h2>
      <Card>
        <CardHeader>
          <CardTitle>広告キャンペーン一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <thead>
              <tr>
                <th>キャンペーン名</th>
                <th>収益</th>
                <th>クリック率</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>夏季プロモーション</td>
                <td>$10,000</td>
                <td>2.5%</td>
              </tr>
              <tr>
                <td>新製品ローンチ</td>
                <td>$15,000</td>
                <td>3.2%</td>
              </tr>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </PageWrapper>
  );

  const UserEngagement = () => (
    <PageWrapper>
      <h2 className="text-2xl font-bold mb-4">ユーザーエンゲージメント</h2>
      <Card>
        <CardHeader>
          <CardTitle>コンテンツ種類別エンゲージメント</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={engagementData} fill="#8884d8" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </PageWrapper>
  );

  const FinancialForecast = () => (
    <PageWrapper>
      <h2 className="text-2xl font-bold mb-4">財務予測</h2>
      <Card>
        <CardHeader>
          <CardTitle>年間収益予測</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </PageWrapper>
  );

  const renderPage = () => {
    switch (currentPage) {
      case '収益概要':
        return <RevenueOverview />;
      case '広告パフォーマンス':
        return <AdPerformance />;
      case 'ユーザーエンゲージメント':
        return <UserEngagement />;
      case '財務予測':
        return <FinancialForecast />;
      default:
        return <RevenueOverview />;
    }
  };

  return (
    <div className={`min-h-screen p-4 ${isDarkMode ? 'dark' : ''}`}>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">X Revenue Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={toggleDarkMode} variant="outline" size="icon">
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCcw className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </header>
      <nav className="mb-6">
        <ul className="flex space-x-2">
          {pages.map((page) => (
            <li key={page}>
              <Button
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
              >
                {page}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <main>{renderPage()}</main>
    </div>
  );
}