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
                  'platform-telemetry', 'li/apfcDf', 'MutationObserver', 'visitor.publishDestinations', 
                  'WebGL context', 'WebGL contexts', 'preloaded using link preload',
                  'link rel=preload', 'ERR_BLOCKED_BY_CLIENT', 'Failed to load resource',
                  'parameter 1 is not of type node', 'failed to execute', 'unload is not allowed', 
                  'Permissions policy violation', 'Self-XSS', 'attackers to impersonate you',
                  'Do not enter or paste code', 'permissions policy', 'violation'
                ].map(s => s.toLowerCase());
                
                function shouldSilence(args) {
                  try {
                    return args.some(arg => {
                      if (!arg) return false;
                      let str = "";
                      if (arg instanceof Error) {
                        str = (arg.message || "") + " " + (arg.stack || "");
                      } else if (typeof arg === 'object') {
                        try { str = JSON.stringify(arg); } catch(e) { str = String(arg); }
                      } else {
                        str = String(arg);
                      }
                      str = str.toLowerCase();
                      return silenceStrings.some(s => str.includes(s));
                    });
                  } catch (e) { return false; }
                }

                const methods = ['log', 'warn', 'error', 'info', 'debug', 'dir', 'table', 'trace', 'group', 'groupCollapsed'];
                methods.forEach(method => {
                  try {
                    const orig = console[method];
                    if (typeof orig === 'function') {
                      console[method] = function(...args) {
                        if (shouldSilence(args)) return;
                        orig.apply(console, args);
                      };
                    }
                  } catch (e) {}
                });

                const forceClear = () => {
                  try { if (typeof console.clear === 'function') console.clear(); } catch (e) {}
                };
                [0, 50, 100, 200, 500, 1000, 2000, 5000].forEach(ms => setTimeout(forceClear, ms));

                const silenceError = (e) => {
                  const payload = [e.message, e.filename, e.error, e.reason];
                  if (shouldSilence(payload)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                };
                window.addEventListener('error', silenceError, true);
                window.addEventListener('unhandledrejection', silenceError, true);
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
