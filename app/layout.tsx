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
                const silenceStrings = [
                  'platform-telemetry', 
                  'li/apfcDf', 
                  'MutationObserver', 
                  'visitor.publishDestinations', 
                  'WebGL context', 
                  'WebGL contexts', 
                  'preloaded using link preload',
                  'link rel=preload',
                  'ERR_BLOCKED_BY_CLIENT',
                  'Failed to load resource',
                  'parameter 1 is not of type \'Node\'',
                  'unload is not allowed',
                  'Permissions policy violation',
                  'Self-XSS',
                  'attackers to impersonate you',
                  'Do not enter or paste code'
                ];
                
                function shouldSilence(args) {
                  try {
                    return args.some(arg => {
                      const str = String(arg).toLowerCase();
                      return silenceStrings.some(s => str.includes(s.toLowerCase()));
                    });
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
