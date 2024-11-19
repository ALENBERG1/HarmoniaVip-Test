import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Loader from './Loader';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      const isAdmin = user.plan === 'admin';
      const isVip = user.plan === 'vip';
      const isFree = user.plan === 'free';

      const restrictedSections = ['documents', 'notes', 'forum', 'elearning'];
      const adminOnlySections = ['development', 'marketing', 'settings'];

      const isPathInSection = (path, section) => path.startsWith(`/${section}`);
      const isInRestrictedSection = restrictedSections.some(section => isPathInSection(router.pathname, section));
      const isAdminPage = adminOnlySections.some(section => isPathInSection(router.pathname, section));

      if (isAdminPage && !isAdmin) {
        router.push('/');
      } else if (isInRestrictedSection && !isVip && !isAdmin) {
        router.push('/');
      }
    }
  }, [user, authLoading, router.pathname]);

  if (authLoading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  const getPageTitle = () => {
    const basePath = router.pathname.split('/')[1];
    const baseTitle = {
      '': 'Dashboard',
      'calendar': 'Calendar',
      'documents': 'Documents',
      'notes': 'Notes',
      'forum': 'Forum',
      'elearning': 'E-Learning',
      'settings': 'Settings',
      'marketing': 'Marketing',
      'development': 'Development'
    }[basePath] || 'Dashboard';

    return baseTitle;
  };

  return (
    <div className="flex h-screen bg-[#0C0C0C]">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        userPlan={user.plan}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#0C1A0E] shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <button
              className="md:hidden text-[#A1A0A0] hover:text-[#F0EDE5]"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-semibold text-[#F0EDE5]">
              {getPageTitle()}
            </h1>
            <div className="text-sm text-[#A1A0A0]">
              {user.username || user.firstName || user.telegramId}
              {user.plan && <span className="ml-2 text-xs text-[#00613A]">({user.plan})</span>}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0C0C0C]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#F0EDE5]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}