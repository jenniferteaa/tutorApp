// import "./globals.css";

// export const metadata = {
//   title: "Tutor Workspace",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

import { Inconsolata } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Tutor notes",
  icons: {
    icon: "/logo.png",
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
    <html lang="en">
      <body className={`${inconsolata.variable} antialiased`}>{children}</body>
    </html>
  );
}
