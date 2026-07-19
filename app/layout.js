import "./styles/globals.css";

export const metadata = {
  title: "Annadata kisan pvt ltd , ujjain Knowledge Base",
  description:
    "A practical knowledge base and rate-list platform for chemical manufacturing products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
