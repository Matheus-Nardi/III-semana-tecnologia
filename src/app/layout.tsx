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
  description: "Evento acadêmico promovido pela Universidade Estadual do Tocantins (UNITINS) que reúne estudantes, pesquisadores e profissionais para discutir avanços em ciência, tecnologia e inovação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="pt-br">
        <head>
          <meta name="apple-mobile-web-app-title" content="III SCTI UNITINS" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        </head>
        <body
          className={`${montserrat.variable} ${poppins.variable} ${dmSans.variable} antialiased`}
        >
          <ClientErrorHandler />
          <Header /> 
          <div className="pt-0">
            <Hero/>
            {/* <Countdown/> */}
            <main id="main-content">
              <AboutEvent/>
              <Schedule/>
              <Partners/>
              {children}
              <News/>
              <Faq/>
              <Location/>
            </main>
            <ScrollToTop/>
          </div>
          <Footer/>
        </body>
      </html>
  );
}
