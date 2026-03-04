import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastViewport } from "@/components/toast/ToastViewport";
import CherryBlossomFX from "@/components/CherryBlossomFX";

export const metadata: Metadata = {
  title: "Waku Waku",
  description: "Découvrez, suivez et notez vos mangas — une expérience fluide et élégante.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="app-bg min-h-screen">
       <CherryBlossomFX density={10} />
        <div className="mx-auto max-w-6xl px-4">
          <Header />
          <main className="py-6">{children}</main>
          <Footer />
        </div>
        <ToastViewport />
      </body>
    </html>
  );
}