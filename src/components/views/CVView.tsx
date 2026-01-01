import React from 'react';
import {cvData} from '../../data/cvData';
import {PATH_CONSOLE} from '../../utils/constants';
import {CommandTerminal} from '../CommandTerminal';
import {WindowControls} from '../WindowControls';

interface Props {
  commandInput: string;
  setCommandInput: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: any) => void;
  commandHistory: {type: string; text: string}[];
  handleNavigateToConsole: () => void;
}

export const CVView = ({
  commandInput,
  setCommandInput,
  handleKeyDown,
  commandHistory,
  handleNavigateToConsole,
}: Props) => {
  return (
    <div className='min-h-screen bg-vscode-bg text-vscode-fg font-mono text-sm'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className='no-print mb-6 border-b border-vscode-border pb-4'>
          <WindowControls
            path={`${PATH_CONSOLE}/cv`}
            handleNavigateToConsole={handleNavigateToConsole}
          />
        </div>

        <div className='no-print'>
          <CommandTerminal
            commandInput={commandInput}
            setCommandInput={setCommandInput}
            handleKeyDown={handleKeyDown}
            commandHistory={commandHistory}
            placeholder='Type "print" to print CV, "back" to return'
          />
        </div>

        {/* CV Content */}
        <div className='mt-8 max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-8 border-b-2 border-accent-success pb-4'>
            <h1 className='text-3xl mb-2 text-syntax-function font-normal'>
              {cvData.name}
            </h1>
            <div className='text-lg text-accent-warning mb-3'>
              {cvData.title}
            </div>
            <div className='text-xs text-gray-500 flex gap-4 flex-wrap'>
              <a
                href={`mailto:${cvData.contact.email}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-500 hover:text-accent-success transition-colors no-underline'
              >
                {cvData.contact.email}
              </a>
              <span>{cvData.contact.location}</span>
              <a
                href={`https://${cvData.contact.linkedin}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-500 hover:text-accent-success transition-colors no-underline'
              >
                {cvData.contact.linkedin}
              </a>
              <a
                href={`https://${cvData.contact.github}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-500 hover:text-accent-success transition-colors no-underline'
              >
                {cvData.contact.github}
              </a>
            </div>
          </div>

          {/* Summary */}
          <div className='mb-8'>
            <h2 className='text-base text-accent-success mb-3 uppercase'>
              // Summary
            </h2>
            <p className='text-vscode-fg leading-relaxed'>{cvData.summary}</p>
          </div>

          {/* Experience */}
          <div className='mb-8'>
            <h2 className='text-base text-accent-success mb-4 uppercase'>
              // Experience
            </h2>
            {cvData.experience.map((exp, idx) => (
              <div
                key={idx}
                className='mb-6 pl-4 border-l-2 border-vscode-border'
              >
                <div className='mb-2'>
                  <div className='text-base text-vscode-fg font-medium'>
                    {exp.title}
                  </div>
                  <div className='text-sm text-accent-warning'>
                    {exp.company}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {exp.period} • {exp.location}
                  </div>
                </div>
                <ul className='my-2 pl-5 text-vscode-fg list-disc'>
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className='mb-1 leading-relaxed'>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className='mb-8'>
            <h2 className='text-base text-accent-success mb-4 uppercase'>
              // Skills
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries(cvData.skills).map(([category, skills]) => (
                <div key={category}>
                  <div className='text-xs text-accent-info mb-1.5 uppercase'>
                    {category}
                  </div>
                  <div className='text-xs text-vscode-fg'>
                    {skills.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className='mb-8'>
            <h2 className='text-base text-accent-success mb-4 uppercase'>
              // Education
            </h2>
            {cvData.education.map((edu, idx) => (
              <div key={idx} className='mb-3'>
                <div className='text-sm text-vscode-fg'>{edu.degree}</div>
                <div className='text-xs text-gray-500'>
                  {edu.institution} • {edu.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
