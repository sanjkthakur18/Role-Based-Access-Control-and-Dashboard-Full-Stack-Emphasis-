import "./globals.css";
import { AuthProvider } from "./context/context";

export const metadata = {
  title: "Role Based Access Control",
  description: "Role-Based-Access-Control-and-Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
