"use client"

import React, { useState } from "react";
import SetGoal from "@/components/getStarted/SetGoal";
import Read from "@/components/getStarted/Read";
import AssessGoal from "@/components/getStarted/AssessGoal";

const GetStarted = () => {
  const [session, setSession] = useState<any | null>(null);
  const [step, setStep] = useState<"set" | "read" | "assess">("set");

  return (
    <main className="flex justify-between w-[90%] mx-auto gap-6">
      <section className="lg:w-[35%] md:w-[35%] w-full">
        <SetGoal
          onStart={(createdSession: any) => {
            setSession(createdSession);
            setStep("read");
          }}
        />

        {step === "assess" && session && (
          <AssessGoal session={session} />
        )}
      </section>

      <section className="lg:w-[60%] md:w-[60%] w-full">
        {step === "read" && session && (
          <Read
            session={session}
            onFinish={() => setStep("assess")}
          />
        )}
      </section>
    </main>
  );
};

export default GetStarted;
