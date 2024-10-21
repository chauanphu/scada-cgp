"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Navbar, PermissionEnum } from "./components/NavBar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { NEXT_PUBLIC_API_URL } from "./lib/api";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [permissions, setPermissions] = useState<PermissionEnum[]>([]);
  const getPermissions = async () => {
    const token = Cookies.get('token');
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/role/check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setPermissions(data.permissions.map((permission: any) => permission.permission_name));
  };
  useEffect(() => {
    getPermissions();
  }, []);
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar permissions={permissions} />
        <main className=" h-screen">{children}</main>
      </body>
    </html>
  );
}
