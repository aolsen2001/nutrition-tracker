import { Link, Outlet } from 'react-router';

export default function Dashboard() {
  return (
    <>
      <h1>This is the login page</h1>
      <Link to='/dashboard'>Return to Dashboard</Link>
      <Outlet />
    </>
  );
}
