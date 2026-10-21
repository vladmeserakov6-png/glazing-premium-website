import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import { site } from "@/content/site";
import { ProjectProvider } from "@/components/project/project-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ПРОСВЕТ — современное остекление для вашего комфорта",
  description: site.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: "ПРОСВЕТ — архитектура остекления",
    description: site.description,
    locale: "ru_RU",
    type: "website",
  },
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
        </ProjectProvider>
      </body>
    </html>
  );
}
