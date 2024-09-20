"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";
import { useGetCallById } from "@/hooks/useGetCallById";
import Loader from "@/components/Loader";

const Meeting = ({ params: { id } }: { params: { id: string } }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);
  if (!isLoaded || isCallLoading) return <Loader></Loader>;
  return (
    <main className="h-screen w-full">
      {call && (
        <StreamCall call={call}>
          <StreamTheme>
            {isSetupComplete ? (
              <MeetingRoom />
            ) : (
              <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
            )}
          </StreamTheme>
        </StreamCall>
      )}
    </main>
  );
};

export default Meeting;
