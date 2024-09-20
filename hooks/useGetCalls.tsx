import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { set } from "react-datepicker/dist/date_utils";
import { start } from "repl";

export const useGetCalls = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const client = useStreamVideoClient();
    const {user } = useUser();
     useEffect(() => {
const loadCalls = async () => {
if(!client || !user?.id) return;
setLoading(true);

try {
    const {calls} = await client.queryCalls({
        sort: [{field: 'starts_at', direction: -1}],
        filter_conditions:{
            starts_at:{$exists: true},
            $or: [
                {created_by_user_id: user.id},
                {members: {$in: [user.id]}}
            ]
        }
    })
    setCalls(calls)
    
} catch (error) {
    console.log(error)
}finally{
     setLoading(false)
}
}
loadCalls()
     },[client, user?.id])

     
     const endedCalls = calls.filter(({state:{startsAt, endedAt}}:Call)=>{
        return (startsAt &&  new Date(startsAt) < new Date() || !!endedAt)
     })
     const upcomingCalls = calls.filter(({state: {startsAt, endedAt}}:Call)=>{
            return startsAt && new Date(startsAt) > new Date
     })
     

     return {loading, calls, endedCalls, upcomingCalls, CallRecordings: calls}
}
