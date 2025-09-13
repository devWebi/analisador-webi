import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./print.css";
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
    <html lang="pt">
      <head></head>

      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
