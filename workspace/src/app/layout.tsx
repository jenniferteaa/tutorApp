import { Inconsolata } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Tutor notes",
  icons: {
    icon: "/icon.svg",
  },
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
        {children}
      </body>
    </html>
  );
}
