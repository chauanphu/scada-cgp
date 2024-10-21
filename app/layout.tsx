"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Navbar, PermissionEnum } from "./components/NavBar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { NEXT_PUBLIC_API_URL } from "./lib/api";
import { WebSocketProvider } from "@/providers/WebsocketProvider";
import { APIProvider, useAPI } from "@/providers/APIProvider";

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
  const { isAuthenticated } = useAPI() || {};

  const getPermissions = async () => {
    const token = Cookies.get('token');
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/role/check`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }

      const data = await response.json();
      setPermissions(data.permissions.map((permission: any) => permission.permission_name));
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  useEffect(() => {
    getPermissions();
  });

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <APIProvider>
          <WebSocketProvider>
            <Navbar permissions={permissions} />
            <main className="h-screen">{children}</main>
          </WebSocketProvider>
        </APIProvider>
      </body>
    </html>
  );
}
