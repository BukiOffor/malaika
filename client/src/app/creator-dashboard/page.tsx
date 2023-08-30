import Dashboard from '@/components/dashboard/Dashboard'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: "Crowda | Dashboard",
  description: "Dashboard page",
}

export default function DashboardPage() {
  return (
    <>
    <Dashboard/>
    </>
  )
}
