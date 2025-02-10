export default function DashboardLayout({ children }) {
  return (
    <>
      <div>Sidebar</div>
      <main>{children}</main>
    </>
  );
}
