import { CreateView } from "@/features/createjob/views/create-job-views";
import { Metadata } from "next";

export const metadata: Metadata = { title: "new job" };


const CreateJob = () => {
    return <CreateView />;
}
 
export default CreateJob;