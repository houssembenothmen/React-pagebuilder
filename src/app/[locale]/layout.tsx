import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Plus_Jakarta_Sans } from "next/font/google"; // ➡️ Using Plus Jakarta Sans instead
import { notFound } from "next/navigation";

const sansFont = Plus_Jakarta_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Page Builder",
    description: "Page builder",
};

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html
            lang={locale}
            dir={locale === "ar" ? "rtl" : "ltr"}
            className={`${sansFont.variable} antialiased font-sans`}
        >
            <body>
                <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </body>
        </html>
    );
}
