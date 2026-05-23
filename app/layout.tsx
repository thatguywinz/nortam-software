import type { Metadata } from "next";
import "./globals.css";
import { AssureProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Nortam Assure — AI speed. Human judgment. Certified trust.",
  description:
    "AI-assisted, human-verified translation and localization platform for high-stakes documents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <AssureProvider>{children}</AssureProvider>
      </body>
    </html>
  );
}
