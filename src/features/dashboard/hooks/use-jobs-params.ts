import { JobsParams } from "@/features/server/params";
import {useQueryStates} from "nuqs";

export const useJobsParms=()=>{
    return useQueryStates(JobsParams)
}