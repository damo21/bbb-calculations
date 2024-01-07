// react imports
import React, { useState, Fragment } from "react";

// css imports
import "./App.css";

// component imports
import WeekLayer from "./components/WeekLayer";

const weeks = [
  {
    week: 1,
    percentage: [45, 65, 75, 85],
  },
  {
    week: 2,
    percentage: [55, 70, 80, 90],
  },
  {
    week: 3,
    percentage: [65, 75, 85, 95],
  },
];

function App() {
  const [value, setValue] = useState(0);

  return (
    <div className="w-screen h-screen bg-green-500 p-1 bg-dark flex flex-col items-center pt-[3%]">
      <div className="bg-cream flex flex-col w-full md:w-2/4 rounded p-2 justify-center">
        <span className="font-semibold text-2xl w-full text-center pb-3 text-dark">
          Enter 90% max in KG
        </span>
        <div className="flex justify-center items-center w-full">
          <input
            className="max-w-[75%] p-1 text-xl font-semibold rounded bg-orange text-cream focus:outline-none focus:ring-0 focus:border-none focus:shadow-none"
            type="number"
            onChange={(e) => setValue(e.target.value)}
            min={0}
          />
        </div>
        <div className="p-1 mt-3 text-dark">
          {weeks.map((week) => (
            <Fragment key={week.week}>
              <span key={`span_${week.week}`} className="font-semibold text-xl">
                Week: {week.week}
              </span>
              <WeekLayer
                key={`weekLayer_${week.week}`}
                kgWeight={value}
                percentages={week.percentage}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
