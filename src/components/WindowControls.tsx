import React from 'react';

interface Props {
  path: string;
  handleNavigateToConsole: () => void;
}

export const WindowControls = ({path, handleNavigateToConsole}: Props) => (
  <div className='flex items-center gap-2 mb-2'>
    <div className='flex gap-1.5'>
      <div
        className='w-3 h-3 rounded-full bg-accent-error cursor-pointer'
        onClick={handleNavigateToConsole}
      ></div>
      <div className='w-3 h-3 rounded-full bg-accent-warning'></div>
      <div className='w-3 h-3 rounded-full bg-accent-success'></div>
    </div>
    <span className='text-gray-500 ml-2'>{path}</span>
  </div>
);
