"use client";

import SetGoal from "@/components/getStarted/SetGoal";
import Read from "@/components/getStarted/Read";
import AssessGoal from "@/components/getStarted/AssessGoal";
import { ReadingProvider } from "@/contexts/ReadingContext";

const GetStarted = () => {
  return (
    <ReadingProvider>
      <main className="flex flex-col lg:flex-row justify-between w-[90%] mx-auto my-8">
        <section className="lg:w-[35%] w-full h-[70vh] overflow-y-scroll">
          <SetGoal />
          <AssessGoal />
        </section>
        <section className="lg:w-[60%] w-full h-[70vh] overflow-y-scroll">
          <Read />
        </section>
      </main>
    </ReadingProvider>
  );
};

export default GetStarted;
