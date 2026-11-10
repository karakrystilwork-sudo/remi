import "./globals.css";

export const metadata = {
  title: "Remi | The Official WFH Club",
  description: "Remi is The Official WFH Club's AI career assistant for moms finding legitimate remote work.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
