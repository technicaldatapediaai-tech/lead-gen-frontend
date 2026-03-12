import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadGenius Login",
  description: "Secure sign-in for the LeadGenius intelligence platform",
};

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const silenceStrings = ['platform-telemetry', 'li/apfcDf', 'MutationObserver', 'visitor.publishDestinations'];
                
                function shouldSilence(args) {
                  try {
                    const str = args.map(a => {
                      if (typeof a === 'string') return a;
                      if (a && a.message) return a.message;
                      if (a && a.stack) return a.stack;
                      return String(a);
                    }).join(' ');
                    return silenceStrings.some(s => str.includes(s));
                  } catch (e) { return false; }
                }

                // Intercept console.error
                const origError = console.error;
                console.error = function(...args) {
                  if (shouldSilence(args)) return;
                  origError.apply(console, args);
                };
                
                // Intercept console.warn
                const origWarn = console.warn;
                console.warn = function(...args) {
                  if (shouldSilence(args)) return;
                  origWarn.apply(console, args);
                };

                // Catch uncaught exceptions
                window.addEventListener('error', function(e) {
                  if (shouldSilence([e.message, e.filename, e.error])) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);

                // Catch uncaught promise rejections
                window.addEventListener('unhandledrejection', function(e) {
                  if (shouldSilence([e.reason])) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
