import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Baby Tracker | מעקב הנקה, שינה, חיתולים וגדילה',
  description: 'Baby Tracker - אפליקציה חכמה למעקב אחר הנקה, בקבוקים, שינה, החתלות ומדדי גדילה לתינוקות וילדים',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👶</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#FADAE4" />
      </head>
      <body className="antialiased text-gray-900 bg-[#fff9fa] min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
