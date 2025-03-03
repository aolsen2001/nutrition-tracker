import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
import '../styles.css';

interface DashboardChildren {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardChildren) {
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
      <div className='dashboard-header'>
        <div className='link-container'>
          <div>Overview</div>
          <div>Meal History</div>
          <div>Log Meal</div>
          <div onClick={handleSignOut}>Sign Out</div>
        </div>
      </div>
      <div className='content'> {children} </div>
    </div>
  );
}

export default DashboardLayout;
