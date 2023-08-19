import type React from 'react';

interface Props {
  options: string[];
  onClick: (val: any) => void;
}

const MultiButton: React.FC<Props> = ({ options, onClick }) => {
  return (
    <div className="flex overflow-hidden rounded-full bg-white/5">
      {options.map((opt, ind) => (
        <div className="flex flex-1" key={opt}>
          <div
            className="grow cursor-pointer py-2 text-center hover:bg-white/10"
            onClick={() => onClick(opt)}
          >
            {opt}
          </div>
          {ind !== options.length - 1 && (
            <div className="my-2 border-l border-white/10" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MultiButton;
