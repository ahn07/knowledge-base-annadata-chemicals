import "./styles/globals.css";
import { ToastProvider } from "./components/ToastProvider";

export const metadata = {
  title: "Annadata kisan pvt ltd , ujjain Knowledge Base",
  description:
    "A practical knowledge base and rate-list platform for chemical manufacturing products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-mist font-sans text-ink antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
