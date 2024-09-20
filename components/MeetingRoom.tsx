import { cn } from "@/lib/utils";
import {
  Call,
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";
type CallLayoutType = "grid" | "speaker-left" | "speaker-right";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuContent,

} from "@/components/ui/dropdown-menu";
import { LayoutListIcon, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal')
  const{useCallCallingState} = useCallStateHooks(); 
  const callingState = useCallCallingState();
  if(callingState !== CallingState.JOINED){
    return <Loader />
  }
  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="text-white relative h-screen w-full overflow-hidden pt-4">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(true)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 hover:bg-[#4c535b]">
              <LayoutListIcon size={20} className="text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
              {["Grid", "Speaker Left", "Speaker Right"].map((item, index) => (
                <div key={index}>
                  <DropdownMenuItem  className="cursor-pointer" onClick={()=>setLayout(item.toLowerCase() as CallLayoutType)}>{item}</DropdownMenuItem>
                </div>
              ))}
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </div>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={()=> setShowParticipants((prev)=> !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2  hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />

          </div>

        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
