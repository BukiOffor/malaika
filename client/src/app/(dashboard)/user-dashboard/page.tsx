import UserDashboard from '@/components/UserDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Malaik | User dashboard',
  description: 'Dashboard page',
};

export default function DashboardPage() {
  return (
    <>
      <UserDashboard />
    </>
  );
}
