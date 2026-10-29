import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import ToastProvider from "@/components/ToastProvider";
import SakuraPetals from "@/components/SakuraPetals";
import ThemeProvider from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import BambooDecor from "@/components/BambooDecor";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ErrorBoundary from "@/components/ErrorBoundary";
import InitialLoader from "@/components/InitialLoader";
import PageTransition from "@/components/PageTransition";
import MotionProvider from "@/components/MotionProvider";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerifSc = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

// Placeholder tracking IDs - configure via env or replace here
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";
const YANDEX_METRICA_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID || "XXXXXXXX";
const VK_PIXEL_ID = process.env.NEXT_PUBLIC_VK_PIXEL_ID || "VK-RTRG-XXXXXX-XXXX";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F0F5EC",
};

export const metadata: Metadata = {
  title: "\u041f\u043e\u0434\u043d\u0435\u0431\u0435\u0441\u043d\u0430\u044f \u2014 \u0430\u0432\u0442\u043e\u0440\u0441\u043a\u0438\u0435 \u0430\u0440\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0441\u0432\u0435\u0447\u0438",
  description:
    "\u0421\u0432\u0435\u0447\u0438, \u0432 \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u0434\u044b\u0448\u0438\u0442 \u041f\u043e\u0434\u043d\u0435\u0431\u0435\u0441\u043d\u0430\u044f. \u0410\u0437\u0438\u0430\u0442\u0441\u043a\u0430\u044f \u0444\u0438\u043b\u043e\u0441\u043e\u0444\u0438\u044f \u0438 \u0430\u0440\u043e\u043c\u0430\u0442\u044b \u0432 \u043a\u0430\u0436\u0434\u043e\u0439 \u0441\u0432\u0435\u0447\u0435.",
  openGraph: {
    title: "\u041f\u043e\u0434\u043d\u0435\u0431\u0435\u0441\u043d\u0430\u044f \u2014 \u0430\u0432\u0442\u043e\u0440\u0441\u043a\u0438\u0435 \u0430\u0440\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0441\u0432\u0435\u0447\u0438",
    description: "\u0421\u0432\u0435\u0447\u0438, \u0432 \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u0434\u044b\u0448\u0438\u0442 \u041f\u043e\u0434\u043d\u0435\u0431\u0435\u0441\u043d\u0430\u044f. \u0410\u0437\u0438\u0430\u0442\u0441\u043a\u0430\u044f \u0444\u0438\u043b\u043e\u0441\u043e\u0444\u0438\u044f \u0438 \u0430\u0440\u043e\u043c\u0430\u0442\u044b \u0432 \u043a\u0430\u0436\u0434\u043e\u0439 \u0441\u0432\u0435\u0447\u0435.",
    type: "website",
    locale: "ru_RU",
    siteName: "\u041f\u043e\u0434\u043d\u0435\u0431\u0435\u0441\u043d\u0430\u044f",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Поднебесная" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "\u041f\u043e\u0434\u043d\u0435\u0431\u0435\u0441\u043d\u0430\u044f \u2014 \u0430\u0432\u0442\u043e\u0440\u0441\u043a\u0438\u0435 \u0430\u0440\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0441\u0432\u0435\u0447\u0438",
    description: "\u0421\u0432\u0435\u0447\u0438, \u0432 \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u0434\u044b\u0448\u0438\u0442 \u041f\u043e\u0434\u043d\u0435\u0431\u0435\u0441\u043d\u0430\u044f. \u0410\u0437\u0438\u0430\u0442\u0441\u043a\u0430\u044f \u0444\u0438\u043b\u043e\u0441\u043e\u0444\u0438\u044f \u0438 \u0430\u0440\u043e\u043c\u0430\u0442\u044b \u0432 \u043a\u0430\u0436\u0434\u043e\u0439 \u0441\u0432\u0435\u0447\u0435.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://podnebesnaya.ru"),
  alternates: {
    canonical: "/",
    languages: {
      "ru-RU": "/",
    },
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${notoSerifSc.variable}`}>
        <ToastProvider>
          <ThemeProvider>
            <SakuraPetals />
          <BambooDecor />
          <CustomCursor />
          <ExitIntentPopup />
          <ErrorBoundary>
            <InitialLoader>
              <MotionProvider>
                <PageTransition>{children}</PageTransition>
              </MotionProvider>
            </InitialLoader>
          </ErrorBoundary>
          <Toast />
          </ThemeProvider>
          <script dangerouslySetInnerHTML={{ __html: "if (\"serviceWorker\" in navigator) { window.addEventListener(\"load\", () => { navigator.serviceWorker.register(\"/sw.js\"); }); }" }} />
        </ToastProvider>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
          async
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>

        {/* Yandex.Metrica */}
        <Script id="yandex-metrica" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${YANDEX_METRICA_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`}
        </Script>
        <noscript>
          <div>
            <img src={`https://mc.yandex.ru/watch/${YANDEX_METRICA_ID}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>

        {/* VK Pixel */}
        <Script id="vk-pixel" strategy="afterInteractive">
          {`!function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://vk.com/rtrg?p=${VK_PIXEL_ID}",document.head.appendChild(t)}();`}
        </Script>
        <noscript>
          <img src={`https://vk.com/rtrg?p=${VK_PIXEL_ID}`} style={{ position: "fixed", left: "-9999px" }} alt="" />
        </noscript>
      </body>
    </html>
  );
}
