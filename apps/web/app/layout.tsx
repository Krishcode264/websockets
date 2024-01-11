
"use client"
import "./globals.css";
import {RecoilRoot} from 'recoil'
import { createContext } from "react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {



  return (
    <html lang="en">
      <body>
        <RecoilRoot>{children}</RecoilRoot>
      </body>
    </html>
  );
}
