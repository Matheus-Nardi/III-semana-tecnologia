import type { Metadata } from "next";
import { Montserrat, Poppins, DM_Sans } from "next/font/google";
import "../globals.css";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import ClientErrorHandler from "../client-error-handler";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Semana de Ciência, Tecnologia e Inovação - UNITINS",
  description: "Evento acadêmico promovido pela Universidade Estadual do Tocantins (UNITINS) que reúne estudantes, pesquisadores e profissionais para discutir ciência, tecnologia e inovação.",
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/favicon_io/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/favicon_io/android-chrome-512x512.png" },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
  metadataBase: new URL("https://unitinscti.com.br"),
  alternates: { canonical: "/" },
  keywords: [
    "Semana de Ciência e Tecnologia",
    "UNITINS",
    "Inovação",
    "Evento",
    "Tecnologia",
    "Palmas",
    "Tocantins",
  ],
  openGraph: {
    title: "Semana de Ciência, Tecnologia e Inovação - UNITINS",
    description: "Evento acadêmico promovido pela Universidade Estadual do Tocantins (UNITINS)...",
    type: "website",
    url: "https://unitinscti.com.br/",
    siteName: "Semana de Ciência, Tecnologia e Inovação - UNITINS",
    locale: "pt_BR",
    images: [
      {
        url: "/logos/logo-snct.png",
        width: 1200,
        height: 630,
        alt: "Logo da Semana de Ciência, Tecnologia e Inovação - UNITINS",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="theme-color" content="#083D77" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${montserrat.variable} ${poppins.variable} ${dmSans.variable} antialiased min-h-screen flex flex-col`}
      >
        <ClientErrorHandler />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
