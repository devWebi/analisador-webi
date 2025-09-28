import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./print.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gerador de Relatórios de Análise de Sites",
  description:
    "Este aplicativo gera relatorios detalhados de análise de sites. Utilize-o para melhorar o desempenho e SEO do seu site.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} antialiased`}>
        {children}

        {/*Aqui ta o codigo do RD */}
        <Script
          id="rdstation-monitoring-script"
          strategy="afterInteractive"
          src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/dfeb70ee-bfce-4e09-90ce-4303137b6f66-loader.js"
        />
      </body>
    </html>
  );
}
