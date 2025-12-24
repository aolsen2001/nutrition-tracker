import { auth } from '../firebase.tsx';
import { signOut, User } from 'firebase/auth';
import { Outlet, useNavigate } from 'react-router';
import '../styles.css';

interface DashboardLayoutProps {
  user: User | null;
}

function DashboardLayout({ user }: DashboardLayoutProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='dashboard-container'>
      <div className='dashboard-sidebar'>
        <div className='link-container'>
          <h1>Nutrition Tracker</h1>
          <div>Currently Signed in As: {user?.email}</div>
          <div className='nav-item' onClick={() => navigate('/dashboard')}>
            Overview
          </div>
          <div className='nav-item'>Meal History</div>
          <div
            className='nav-item'
            onClick={() => navigate('/dashboard/logmeal')}
          >
            Log Meal
          </div>
          <div className='nav-item' onClick={handleSignOut}>
            Sign Out
          </div>
        </div>
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
