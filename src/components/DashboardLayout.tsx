import { getAuth, signOut, User } from 'firebase/auth';
import { useNavigate } from 'react-router';
import '../styles.css';

interface DashboardLayoutProps {
  user: User | null;
  children: React.ReactNode;
}

function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const auth = getAuth();
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
          <h1>NutriLite</h1>
          <div>Currently Signed in As: {user?.email}</div>
          <div className='nav-item'>Overview</div>
          <div className='nav-item'>Meal History</div>
          <div className='nav-item'>Log Meal</div>
          <div className='nav-item' onClick={handleSignOut}>
            Sign Out
          </div>
        </div>
      </div>
      <div className='content'> {children} </div>
    </div>
  );
}

export default DashboardLayout;
