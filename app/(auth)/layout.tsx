// Auth route group — renders with NO sidebar or header.
// ThemeProvider and RoleProvider are already in the root layout.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#ECECEC] dark:bg-[#131313] transition-colors duration-300">
      {children}
    </div>
  );
}
