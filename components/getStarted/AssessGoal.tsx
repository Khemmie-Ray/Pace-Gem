import React from "react";

const AssessGoal = ({ session }: { session: any }) => {
  const wordsRead = session.book.chapters[0].words.length;
  const timeSpent = Math.round(wordsRead / session.wpm);

  return (
    <div className="my-8">
      <h2 className="text-[20px] font-bold font-montserrat mb-6 bg-linear-to-br from-purple-400 to-white bg-clip-text text-transparent">
        Assess Goals
      </h2>

      <div className="flex flex-wrap text-center">
        <Stat label="Goal pace" value={session.wpm} />
        <Stat label="Actual pace" value={session.wpm - 15} />
        <Stat label="Words completed" value={wordsRead} />
        <Stat label="Time spent (min)" value={timeSpent} />
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="w-[48%] md:w-[32%] py-4 border-r border-white/20">
    <p className="text-sm">
      {label}
      <br />
      <span className="text-lg font-bold">{value}</span>
    </p>
  </div>
);

export default AssessGoal;
