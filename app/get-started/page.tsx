"use client";

import SetGoal from "@/components/getStarted/SetGoal";
import Read from "@/components/getStarted/Read";
import AssessGoal from "@/components/getStarted/AssessGoal";
import { ReadingProvider } from "@/contexts/ReadingContext";

const GetStarted = () => {
  return (
    <ReadingProvider>
      <main className="flex flex-col lg:flex-row md:flex-row justify-between w-[90%] mx-auto my-8">
        <section className="lg:w-[35%] w-full lg:h-[70vh] md:h-[60vh] h-[60vh]  overflow-y-scroll lg:order-1 md:order-1 order-2">
          <SetGoal />
          <AssessGoal />
        </section>
        <section className="lg:w-[60%] w-full lg:h-[70vh] md:h-[60vh] h-[60vh] overflow-y-scroll lg:mb-0 md:mb-0 mb-6 lg:order-2 md:order-2 order-1">
          <Read />
        </section>
      </main>
    </ReadingProvider>
  );
};

export default GetStarted;
