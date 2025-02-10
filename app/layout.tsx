import Link from "next/link"
import type React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <Link href="/" className="font-bold text-xl">
              Image Rating App
            </Link>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}



import './globals.css'