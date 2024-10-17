import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
export const metadata = {
  title: "Gible Swap",
  description: "Decentrailized exchange with jupiter api",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
