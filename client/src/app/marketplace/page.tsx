import MarketList from "@/components/MarketList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crowda | Marketplace",
  description: "Crowda is a marketplace for crowdfunding projects.",
};

export default function MarketPlacePage() {
  return (
    <>
      <MarketList />
    </>
  );
}
