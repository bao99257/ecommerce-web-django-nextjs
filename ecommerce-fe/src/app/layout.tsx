import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Thay thế Geist bằng Inter
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

// Cấu hình font Inter hỗ trợ tiếng Việt
const inter = Inter({
  subsets: ["vietnamese"], // Quan trọng: Phải có vietnamese
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KINGSHOP - Hệ thống mua sắm trực tuyến",
  description: "Cung cấp sản phẩm thời trang nam nữ cao cấp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi"> {/* Đổi en thành vi */}
      <body
        className={`${inter.className} antialiased text-gray-900`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
} 