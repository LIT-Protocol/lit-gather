import React from 'react';

export const H2Step = ({step, text}) => {
  return <h2 className="pl-1 text-white text-base mt-4 flex justify-start">
  <div className="rounded-full w-6 h-6 text-xs bg-orange bg-lit-400 text-center flex justify-center">
      <span className="m-auto">{step}</span>
  </div>
  <div className="ml-2 m-t-auto my-auto">{text}</div>
</h2>;
};
