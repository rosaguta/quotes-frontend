import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quotes",
  description: "Find all the crazy and wacky quotes on this website :3"
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <head>
        <title>Quotes</title>
        <meta name="description" content="Find all the crazy and wacky quotes on this website :3" />
        <meta property="og:title" content="Quotes" />
        <meta property="og:description" content="Find all the crazy and wacky quotes on this website :3" />
        <meta property="og:image" content="https://quotes.divsphere.net/quote.png" />
        <meta property="og:url" content="https://quotes.divsphere.net/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Quotes" />
        <meta name="twitter:description" content="Find all the crazy and wacky quotes on this website :3" />
        <meta name="twitter:image" content="https://quotes.divsphere.net/quote.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}