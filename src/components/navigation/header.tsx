'use client';

import React from 'react';
import Link from 'next/link';
import { MainNav } from '@/components/navigation/main-nav';
import { UserNav } from '@/components/navigation/user-nav';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';

export function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center">
          <Link
            href="/dashboard"
            className="mr-6 flex items-center space-x-2"
          >
            <span className="hidden text-base font-bold tracking-tight sm:inline-block">
              BAWES
            </span>
          </Link>
          <MainNav className="mx-6 hidden lg:flex" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <Sidebar />
      <MobileNav />
    </>
  );
}
