'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, BarChart3, Layers, Settings, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Navbar Component
function Navbar() {
  return (
    <nav className='flex items-center justify-between bg-white dark:bg-gray-900 p-4 shadow-md'>
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-2 text-gray-400' size={18} />
          <Input className='pl-10 w-72' placeholder='Search for a strategy...' />
        </div>
      </div>

      <div className='flex items-center space-x-4'>
        <Button className='bg-blue-600 text-white px-4 py-2'>+ Create Strategies Using AI</Button>
        <Bell className='cursor-pointer text-gray-600 dark:text-white' size={24} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center space-x-2 text-gray-700 dark:text-white'>
              <span>Rena Shah</span>
              <ChevronDown size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

// Profile Page
export default function ProfilePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Statistics Section */}
      <div className="grid grid-cols-5 gap-4 p-6">
        <StatCard title="Odyssey Strategies" value="5" icon={<Layers className="text-green-600" />} />
        <StatCard title="Tweak Strategies" value="3" icon={<Settings className="text-pink-600" />} />
        <StatCard title="Custom Strategies" value="2" icon={<BarChart3 className="text-orange-600" />} />
        <StatCard title="Total Running Strategies" value="4" icon={<PlusCircle className="text-blue-600" />} />
        <StatCard title="Today's P&L" value="₹12,500.50" icon={<BarChart3 className="text-green-600" />} />
      </div>

      {/* Portfolio Table */}
      <div className="bg-white mx-6 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">My Portfolio</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Strategy</th>
                <th className="py-3 px-6 text-left">Instrument(s)</th>
                <th className="py-3 px-6 text-left">Tag</th>
                <th className="py-3 px-6 text-left">Live Reports</th>
                <th className="py-3 px-6 text-left">Progress</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {portfolioData.map((strategy, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">{strategy.name}</td>
                  <td className="py-3 px-6">{strategy.instruments}</td>
                  <td className="py-3 px-6">{strategy.tag}</td>
                  <td className="py-3 px-6">{strategy.liveReport}</td>
                  <td className="py-3 px-6">{strategy.progress}</td>
                  <td className="py-3 px-6">
                    <Button className="bg-blue-500 text-white px-3 py-1 text-sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// Sample Portfolio Data
const portfolioData = [
  { name: 'Breakout Strategy', instruments: 'NIFTY, BANKNIFTY', tag: 'High Volatility', liveReport: 'Live', progress: 'Running' },
  { name: 'Mean Reversion', instruments: 'Reliance, TCS', tag: 'Low Risk', liveReport: 'Stopped', progress: 'Completed' },
  { name: 'Scalping Bot', instruments: 'BTC, ETH', tag: 'Crypto', liveReport: 'Live', progress: 'Running' },
  { name: 'Momentum Trade', instruments: 'Apple, Tesla', tag: 'Stocks', liveReport: 'Paused', progress: 'On Hold' },
];
