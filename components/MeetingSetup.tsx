"use client";
import React, { useEffect, useState } from "react";
import {
  useCall,
  VideoPreview,
  DeviceSettings,
} from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const [isMicCamEnabled, setIsMicCamEnabled] = useState(false);
  const call = useCall();
  if (!call) {
    throw new Error("Usecall must be used within a StreamCall component");
  }
  useEffect(() => {
    if (isMicCamEnabled) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamEnabled, call?.camera, call?.microphone]);
  return (
    <div className="flex h-screen w-full flex-col items-center  justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3 ">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            name=""
            checked={isMicCamEnabled}
            onChange={(e) => setIsMicCamEnabled(e.target.checked)}
            id=""
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
        className="rounded-mb bg-green-500 px-4 py-2.5"
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
