import { requireauth } from "@/lib/auth-utils";

const Dashboard = async() => {
    await requireauth();
    return ( 
        <div className="">
            this is a protected page
        </div>
     );
}
 
export default Dashboard;