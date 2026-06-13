import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Fontes usadas pelos templates (sans / serif / mono).
const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const lora = Lora({ variable: "--font-serif", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

const description =
  "Monte um currículo profissional em minutos. Vários modelos prontos, edição ao vivo e download em PDF. 100% grátis e sem cadastro.";

export const metadata: Metadata = {
  metadataBase: new URL("https://curriculo.io"),
  title: "Currículo.io — Crie seu currículo grátis, simples e bonito",
  description,
  keywords: [
    "currículo grátis",
    "criar currículo online",
    "modelo de currículo",
    "currículo PDF",
    "gerador de currículo",
    "currículo ATS",
  ],
  openGraph: {
    title: "Currículo.io — Crie seu currículo grátis, simples e bonito",
    description,
    type: "website",
    locale: "pt_BR",
    siteName: "Currículo.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "Currículo.io — Crie seu currículo grátis",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${lora.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-900">{children}</body>
    </html>
  );
}
