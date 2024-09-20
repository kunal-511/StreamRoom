"use client"; 

import React, { useState, useEffect } from "react";

const RealTimeClock = () => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    new Date()
  );

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
      <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
    </div>
  );
};

export default RealTimeClock;
