import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "../lib/utils";
import { MachineStateProvider } from "../components/context/machineStateProvider";
import { CocktailProvider } from "../components/context/cocktailProvider";
import "./globals.css";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Cocktail Mixer",
  description: "Mix your favorite cocktails with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <CocktailProvider>
          <MachineStateProvider>{children}</MachineStateProvider>
        </CocktailProvider>
      </body>
    </html>
  );
}
