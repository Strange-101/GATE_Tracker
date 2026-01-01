import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MainDashboard from '@/components/MainDashboard';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.centerContainer}>
        <Header />
        <MainDashboard />
      </div>
      {/* RightSidebar removed */}
    </div>
  );
}
