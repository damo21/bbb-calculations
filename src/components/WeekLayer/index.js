import React, { useEffect, useState } from "react";

const workoutWeight = (kgWeight, pVal) => {



  const result = (kgWeight * pVal) / 100;

  const roundedValue = Math.round(result / 2.5) * 2.5;
  return roundedValue.toFixed(1);
};


const WeekLayer = ({ kgWeight, percentages, setPerc }) => {
  

  return (
    <div className="bg-green rounded p-2 text-lg font-semibold text-cream flex flex-col">
      <div className="flex justify-center items-center border-b-2 border-dark">
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 2xl:w-1/4 text-center">
          Warmup
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 2xl:w-1/4 text-center">
          1st Set
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 2xl:w-1/4 text-center">
          2nd Set
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 2xl:w-1/4 text-center">
          3rd Set
        </div>
      </div>
      <div className="flex justify-center items-center">
        {percentages.map((p) => {
          return (
            <div
              key={`outerDiv${p}`}
              className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 2xl:w-1/4 text-center"
            >
              {workoutWeight(workoutWeight(kgWeight, setPerc), p)} Kg
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekLayer;
