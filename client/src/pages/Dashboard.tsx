import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/dashboard/DashSidebar';
import { DashProfile } from '../components/dashboard/DashProfile';
import { Tab } from '../app/schema/search';

export const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState<Tab>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get('tab') as Tab;
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Main */}
      <DashMain tab={tab} />
    </div>
  );
};

type Props = {
  tab: Tab;
};

const DashMain = ({ tab }: Props) => {
  if (!tab) {
    return null;
  }

  return {
    /** profile */
    profile: <DashProfile />,
  }[tab];
};
