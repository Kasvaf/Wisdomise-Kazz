import { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  description: string | ReactNode;
}

function PanelTitle({ title, description }: PageTitleProps) {
  return (
    <div className="mb-8 flex flex-col">
      <span className="mb-2 font-campton text-xl text-white xl:text-2xl">
        {title}
      </span>
      <span className="text-sm font-normal text-nodata">{description}</span>
    </div>
  );
}

export default PanelTitle;
