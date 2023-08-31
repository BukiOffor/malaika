import MarketList from '@/components/MarketList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Malaika | Marketplace',
  description: 'Malaika is a marketplace for crowdfunding projects.',
};

export default function MarketPlacePage() {
  return (
    <>
      <MarketList />
    </>
  );
}
