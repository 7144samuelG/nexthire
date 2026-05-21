import { DashboardView } from "@/features/dashboard/views/dashboard-view";
import { Metadata } from "next";

export const metadata: Metadata = { title: "dashboard" };


const Dashboard = () => {
    return <DashboardView />;
}
 
export default Dashboard;