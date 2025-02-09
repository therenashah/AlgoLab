'use client';

import { useState } from 'react';
import { Search, Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className='flex items-center justify-between bg-white dark:bg-gray-900 p-4 shadow-md'>
      {/* Left - Branding & Search Bar */}
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-2 text-gray-400' size={18} />
          <Input className='pl-10 w-72' placeholder='Search for a strategy...' />
        </div>
      </div>
      
      {/* Right - Actions */}
      <div className='flex items-center space-x-4'>
        <Button className='bg-blue-600 text-white px-4 py-2'>+ Create Strategies Using AI</Button>
        <Bell className='cursor-pointer text-gray-600 dark:text-white' size={24} />
        
        
        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center space-x-2 text-gray-700 dark:text-white'>
              <span>Rena Shah</span>
              <ChevronDown size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => router.push('/profileR')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Settings')}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Logout')}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
