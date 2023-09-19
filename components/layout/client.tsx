import { ComplexNavbar } from "../Nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ComplexNavbar />
      {children}
    </>
  );
}
