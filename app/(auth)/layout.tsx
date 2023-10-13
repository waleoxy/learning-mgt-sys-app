import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMS Signup/Signin page",
  description: "Signup or signin to the Learing management system application",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
}
