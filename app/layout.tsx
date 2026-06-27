import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { AlertProvider } from "@/components/AlertModal";
import { ThemeProvider } from "@/components/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import CityPicker from "@/components/CityPicker";
import { AppProvider } from "@/components/AppContext";

export const metadata: Metadata = {
  title: "وام اینجاست | پلتفرم جامع خرید و فروش امتیاز وام",
  description: "پلتفرم واسطه‌گری مالی (Escrow) برای اتصال فروشندگان امتیاز وام و خریداران",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/vazirmatn/Vazirmatn-font-face.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-divar-bg text-divar-text transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <AlertProvider>
              <AppProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <LoginModal />
                <CityPicker />
              </AppProvider>
            </AlertProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
