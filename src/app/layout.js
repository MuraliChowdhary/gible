import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import Navbar from "@/components/Navbar";
export const metadata = {
  title: "Gible Swap",
  description: "Decentrailized exchange with jupiter api",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
