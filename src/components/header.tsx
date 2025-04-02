"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-xl">
            Notifything
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] md:hidden">
            <DropdownMenuLabel>Navigation</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/features">Features</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/pricing">Pricing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/about">About</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isSignedIn ? (
              <>
                <DropdownMenuLabel>
                  {user?.firstName ? `Hi, ${user.firstName}` : "Account"}
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignInButton
                  // signOutCallback={() => setMobileMenuOpen(false)}
                  >
                    Sign Out
                  </SignInButton>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>
                  <SignInButton mode="modal">Sign In</SignInButton>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignUpButton mode="modal">Sign Up</SignUpButton>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
