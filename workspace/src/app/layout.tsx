import { Inconsolata } from "next/font/google";
import BackendStatusBanner from "@/components/BackendStatusBanner";
import "./globals.css";

export const metadata = {
  title: "Tutor notes",
};

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inconsolata",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inconsolata.variable} antialiased`}
      >
        <BackendStatusBanner />
        {children}
      </body>
    </html>
  );
}
