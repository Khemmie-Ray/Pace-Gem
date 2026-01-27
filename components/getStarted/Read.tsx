import React from "react";

type ReadProps = {
  session: any;
  onFinish: () => void;
};

const Read = ({ session, onFinish }: ReadProps) => {
  if (!session) return null;

  return (
    <main>
      <section className="w-full border border-white/20 rounded-xl flex flex-col justify-center items-center h-[60vh] gap-6">
        <p className="text-[60px]">Reading</p>

        <button
          onClick={onFinish}
          className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
        >
          Finish Reading
        </button>
      </section>
    </main>
  );
};

export default Read;
