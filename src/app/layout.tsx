import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import { site } from "@/content/site";
import { ProjectProvider } from "@/components/project/project-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QuickActions } from "@/components/layout/quick-actions";
import { assetPath, siteUrl } from "@/lib/paths";
import "./globals.css";
import "./interactions.css";
import "./tahion.css";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: "TAHION — больше света, ближе к миру",
  description: site.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: "TAHION — больше света, ближе к миру",
    description: site.description,
    locale: "ru_RU",
    type: "website",
    url: `${siteUrl}/`,
    images: [
      {
        url: new URL(`${siteUrl}/images/tahion-hero.webp`).href,
        width: 1672,
        height: 941,
        alt: "Архитектурная идея панорамного остекления",
      },
    ],
  },
  alternates: { canonical: `${siteUrl}/` },
  icons: { icon: assetPath("/icon.svg") },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <ProjectProvider>
          <a href="#main" className="skip-link">
            Перейти к содержимому
          </a>
          <div id="top" />
          <Header />
          {children}
          <Footer />
          <QuickActions />
        </ProjectProvider>
      </body>
    </html>
  );
}
