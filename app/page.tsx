import React from "react";
import Image from "next/image";
import bgImg from "../public/bg.png";
import Link from "next/link";

const Home = () => {
  return (
    <main className="w-[90%] mx-auto lg:my-20 md:my-12 my-6">
      <section className="flex justify-between flex-col lg:flex-row md:flex-row">
        <div className="w-full  lg:w-[58%] md:w-[58%] relative">
          <h1 className="lg:text-[200px] md:text-[1440px] text-[110px] opacity-10 font-black leading-10 absolute top-0">
            Read.
          </h1>
          <p className="text-[14px] p-2 px-6 border border-[#B840F9] text-[#B840F9] rounded-full inline-block mt-4">
            One Word. One Moment.
          </p>
          <h2 className="lg:text-[60px] md:text-[54px] text-[42px] font-bold font-montserrat">
            Reading, Reclaimed.
          </h2>
          <div className="lg:text-[20px] md:text-[18px] text-[18px] my-6 font-light w-full lg:w-[90%] md:w-[90%]">
            <p>
              Pace turns reading into a deliberate act. Upload any ebook, set
              your reading speed, and consume words one by one — free from
              distraction, scrolling, or skimming.
            </p>
            <p className="mt-3">
              Reading becomes measured. Progress becomes real.
            </p>
          </div>
          <Link href='/get-started' className="bg-linear-to-br from-[#5F5DFC] to-[#B840F9] rounded-lg py-3 px-8 w-full lg:w-[40%] md:w-[50%] lg:text-[18px] md:text-[18px] text-[16px] font-semibold">
            Get Started
          </Link>
             <div className="w-full my-10 block md:hidden lg-hidden">
          <Image
            src={bgImg}
            alt="hero section image"
            width={200}
            height={200}
            className="w-full mx-auto rounded-2xl"
          />
        </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur w-full mt-6">
            <ul className="space-y-4 flex justify-between items-baseline text-[14px] flex-col lg:flex-row md:flex-row">
              <li className="w-full lg:w-[24%] md:w-[23%]">
                <p className="font-semibold text-white mb-1">Upload an ebook</p>
                <p className=" text-gray-400">
                  Add any PDF and let Pace prepare it for focused reading.
                </p>
              </li>

              <li className="w-full lg:w-[24%] md:w-[23%]">
                <p className="font-semibold text-white mb-1">Set a goal</p>
                <p className="text-sm text-gray-400">
                  Choose your pace and define how much you want to read.
                </p>
              </li>

              <li className="w-full lg:w-[24%] md:w-[23%]">
                <p className="font-semibold text-white mb-1">Start reading</p>
                <p className="text-sm text-gray-400">
                  Words appear one at a time, guided by your chosen speed.
                </p>
              </li>

              <li className="w-full lg:w-[24%] md:w-[23%]">
                <p className="font-semibold text-white mb-1">Review progress</p>
                <p className="text-sm text-gray-400">
                  See how closely your reading matched your goal.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="lg:w-[35%] md:w-[35%] lg:block md:block hidden">
          <Image
            src={bgImg}
            alt="hero section image"
            width={200}
            height={200}
            className="w-full mx-auto rounded-2xl"
          />
        </div>
      </section>
    </main>
  );
};

export default Home;
