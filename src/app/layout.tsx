import type { Metadata } from "next";
import { Montserrat, Poppins, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/project/Header";
import Hero from "@/components/project/Hero";
import Countdown from "@/components/project/Countdown";
import AboutEvent from "@/components/project/About";
import Schedule from "@/components/project/Schedule";
import Partners from "@/components/project/Partners";
import Footer from "@/components/project/Footer";
import Faq from "@/components/project/Faq";
import Location from "@/components/project/Location";
import Subscription from "@/components/project/Subscription";
import News from "@/components/project/News";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import ClientErrorHandler from "./client-error-handler";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
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
  title: "III Semana de Ciência,Tecnologia e Inovação - UNITINS",
  description: "Evento acadêmico promovido pela Universidade Estadual do Tocantins (UNITINS) que reúne estudantes, pesquisadores e profissionais para discutir ciência, tecnologia e inovação.",
  openGraph: {
    title: "III Semana de Ciência,Tecnologia e Inovação - UNITINS",
    description: "Evento acadêmico promovido pela Universidade Estadual do Tocantins (UNITINS)...",
    type: "website",
    images: ["/logos/logo-snct.png"], 
  },
};  
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body
        className={`${montserrat.variable} ${poppins.variable} ${dmSans.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <ScrollToTop />
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
