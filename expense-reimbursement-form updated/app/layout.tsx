import { IBM_Plex_Sans_Condensed } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import type React from "react"

const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans-condensed",
})

export const metadata: Metadata = {
  title: "Expense Management System",
  description: "Submit and manage expense reimbursement requests",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${ibmPlexSansCondensed.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

