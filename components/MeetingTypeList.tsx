"use client";
import React, { useState } from "react";
import HomeCard from "@/components/HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/hooks/use-toast";

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();

  const { user } = useUser();
  const client = useStreamVideoClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [callDetails, setCallDetails] = useState<Call>();
  const { toast } = useToast();
  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create a call");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetails(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({ title: "Meeting created successfully" });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create a meeting",
        description: "Please try again",
      });
    }
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        title="New Meeting"
        description="Start an instant meeting"
        img="/icons/add-meeting.svg"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        title="Schedule Meeting"
        description="Plan your meeting in advance"
        img="/icons/schedule.svg"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      <HomeCard
        title="New Meeting"
        description="Start an instant meeting"
        img="/icons/join-meeting.svg"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />
      <HomeCard
        title="View Recordings"
        description="Check out your recordings"
        img="/icons/recordings.svg"
        handleClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />

     <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        // eslint-disable-next-line react/no-children-prop
        handleClick={createMeeting} children={undefined}      />
    </section>
  );
};

export default MeetingTypeList;
