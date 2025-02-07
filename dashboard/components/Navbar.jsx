import Link from "next/link";
import { onAuthStateChanged } from "../firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signout } from "../firebase/auth";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  async function handleLogOut(e) {
    e.preventDefault();
    await signout();
    router.push("/");
  }

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="#">
        {/* Logo or Branding can be added here */}
      </Link>

      <nav className="flex items-center ml-auto space-x-4">
        <Link href="/home">
          <p className="text-gray-900 dark:text-gray-100">Home</p>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>Portfolio</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Your Portfolio</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/portfolio/visuals"><DropdownMenuItem>Visualized</DropdownMenuItem></Link>
            <Link href="/portfolio/stats"><DropdownMenuItem>Stats</DropdownMenuItem></Link>
            <Link href="/portfolio/optimal"><DropdownMenuItem>Optimized Portfolio</DropdownMenuItem></Link>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>Insights</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Global Insights</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/assets/gold"><DropdownMenuItem>Gold</DropdownMenuItem></Link>
            <Link href="/assets/stocks"><DropdownMenuItem>Stocks</DropdownMenuItem></Link>
            <Link href="/assets/bonds"><DropdownMenuItem>Bonds</DropdownMenuItem></Link>
            <Link href="/assets/mfs"><DropdownMenuItem>Mutual Funds</DropdownMenuItem></Link>
            <Link href="/assets/news"><DropdownMenuItem>News</DropdownMenuItem></Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2">
              <p className="text-gray-900 dark:text-gray-100 font-semibold">{user.displayName || "User"}</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
              <DropdownMenuItem onClick={handleLogOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/login">
              <p className="text-gray-900 dark:text-gray-100">Login</p>
            </Link>
            <Link href="/signup">
              <p className="text-gray-900 dark:text-gray-100">Sign Up</p>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};
      