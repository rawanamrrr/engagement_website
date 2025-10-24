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
  metadataBase: new URL("https://zeyadandrawan.netlify.app"),
  title: "Welcome to Our Beginning",
  description: "Celebrating the start of our journey together",
  openGraph: {
    url: "https://zeyadandrawan.netlify.app/",
    type: "website",
    title: "Welcome to Our Beginning",
    description: "Celebrating the start of our journey together",
    images: [
      {
        url: "https://zeyadandrawan.netlify.app/invitation-design.png",
        width: 1200,
        height: 630,
        alt: "Our Engagement Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Welcome to Our Beginning",
    description: "Celebrating the start of our journey together",
    images: ["https://zeyadandrawan.netlify.app/invitation-design.png"],
  },
  icons: {
    icon: "/invitation-design.png",
    apple: "/invitation-design.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#">
      <head>
        {/* ✅ fb:app_id must be manually added (Next.js doesn't include it in metadata) */}
        <meta property="fb:app_id" content="1234567890" />

        {/* ✅ Ensure og:url explicitly exists in the HTML (in case Next skips it) */}
        <meta property="og:url" content="https://zeyadandrawan.netlify.app/" />

        {/* Preload critical assets */}
        <link rel="preload" href="/invitation-design.png" as="image" type="image/png" />
        <link rel="preload" href="/invitation-design.gif" as="image" type="image/gif" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
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
