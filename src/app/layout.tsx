import "./globals.css";

export const metadata = {
  title: "Garage PDF Invoice",
  description: "Garage PDF invoice generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
