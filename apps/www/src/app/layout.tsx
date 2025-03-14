import "@plobbo/ui/globals.css";
import "~/styles/globals.css";

type Props = Readonly<{ children: React.ReactNode }>;
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={`flex-1 antialiased`}>{children}</body>
    </html>
  );
}
