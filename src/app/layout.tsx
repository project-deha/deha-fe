"use client";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import UserHeader from "@/components/layout/UserHeader";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isUserPage = pathname.startsWith("/user");

  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {isUserPage ? <UserHeader /> : <Header />}
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
