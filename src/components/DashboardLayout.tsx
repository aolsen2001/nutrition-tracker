import '../styles.css';

interface DashboardChildren {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardChildren) {
  return (
    <div className='dashboard-container'>
      <div className='dashboard-header'>Header Content</div>
      <div className='content'> {children} </div>
    </div>
  );
}

export default DashboardLayout;
