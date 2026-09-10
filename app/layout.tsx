import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Hữu Tài Genz - Chuyên Gia Khảo Thí & Đo Lường Giáo Dục',
  description: 'Hữu Tài Genz - 0902155906. Chuyên gia về Khảo thí - đo lường - đánh giá - kì thi chuyên biệt - kiểm tra đầu vào, đầu ra học phần, CTĐT.',
  keywords: 'Hữu Tài Genz, Khảo thí, Đo lường giáo dục, Đánh giá năng lực, Kì thi chuyên biệt, Chuẩn đầu ra CTĐT, QBank',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}