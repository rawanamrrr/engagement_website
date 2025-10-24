import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { RomanticAudio } from "@/components/romantic-audio"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LanguageToggle } from "@/components/language-toggle"
import { Footer } from "@/components/footer"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://zeyadandrawan.netlify.app'),
  title: "Zeyad & Rawan - Save the Date",
  description: "You are invited to the engagement of Zeyad & Rawan | Friday, November 7, 2025 at 07:00 PM | Diva Garden Hall, Talkha City | Join us as we begin our journey of love and togetherness",
  generator: "Digitiva",
  openGraph: {
    title: "Zeyad & Rawan - Save the Date",
    description: "You are invited to the engagement of Zeyad & Rawan | Friday, November 7, 2025 at 07:00 PM | Diva Garden Hall, Talkha City",
    images: [
      {
        url: "https://zeyadandrawan.netlify.app/invitation-design.png",
        width: 768,
        height: 1365,
        alt: "Zeyad & Rawan Engagement Invitation - Save the Date",
      },
    ],
    type: "website",
    siteName: "Zeyad & Rawan Engagement",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeyad & Rawan - Save the Date",
    description: "You are invited to the engagement of Zeyad & Rawan | Friday, November 7, 2025 at 07:00 PM | Diva Garden Hall, Talkha City",
    images: ["https://zeyadandrawan.netlify.app/invitation-design.png"],
  },
  icons: {
    icon: "/invitation-design.png",
    apple: "/invitation-design.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical images for immediate loading */}
        <link 
          rel="preload" 
          href="/invitation-design.png" 
          as="image" 
          type="image/png"
        />
        {/* Preload GIF with high priority to eliminate lag on Netlify */}
        <link 
          rel="preload" 
          href="/invitation-design.gif" 
          as="image" 
          type="image/gif"
        />
        {/* Preconnect to domains for faster loading */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
        {/* Preload Google Fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
          as="style"
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable}`}>
        <LanguageProvider>
          <Suspense fallback={null}>
            <LanguageToggle />
            {children}
            <RomanticAudio />
            <Footer />
          </Suspense>
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}