/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "@/hooks/use-toast";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { endedCalls, upcomingCalls, CallRecordings, loading } = useGetCalls();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const router = useRouter();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return CallRecordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  const {toast} = useToast()

  useEffect(() => {
const fetchRecordings = async () => {

  try {
    const CallData = await Promise.all(
      CallRecordings.map((meeting) => meeting.queryRecordings())
    );
    const recordings = CallData.filter(
      (call) => call.recordings.length > 0
    ).flatMap((call) => call.recordings);
    setRecordings(recordings);
  } catch (error) {
    toast({title: "Error", description: error.message, status: "error"})
  }

}
if(type === "recordings") {
  fetchRecordings()
}
  },[type, CallRecordings ])

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {loading ? (
        <div className="flex justify-center items-center">
          {" "}
          <Loader />{" "}
        </div>
      ) : calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 26) ||
              meeting.filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              meeting.start_time.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            buttonText={type === "recordings" ? "Play" : "Join"}
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
