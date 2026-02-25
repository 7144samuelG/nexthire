import {useQueryStates} from "nuqs";
import { JobsParams } from "../params";
export const useJobsParams=()=>{
    return useQueryStates(JobsParams)
}