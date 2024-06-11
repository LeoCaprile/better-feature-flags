import "./globals.css";
import { auth } from "./auth";
import Navbar from "@/components/modules/Navbar";
import Providers from "@/providers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar isLogged={!!session} />
          <main className="px-6 pb-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
