import type { Metadata } from "next";
import "@fontsource/prompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuiltBySelf - By Adivise",
  description: "BuiltBySelf is a tool that helps you create banners for your website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="banner-builders-ui-theme";var t=localStorage.getItem(k);if(t!=="dark"&&t!=="light")t="light";document.documentElement.setAttribute("data-theme",t);document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="h-full overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
