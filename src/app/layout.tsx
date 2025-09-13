import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Montserrat, Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700']
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})


export const metadata: Metadata = {
  title: 'StudyFlowAI',
  description: 'A personalized study system with AI-driven recommendations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${montserrat.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
