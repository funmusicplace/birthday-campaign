import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cubano = localFont({
  src: "../public/cubano-sharp.woff2",
});

export const metadata: Metadata = {
  title: "Feed the Birds | Support Mirlo",
  description: "Support another year of independent music on Mirlo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cubano.className} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
