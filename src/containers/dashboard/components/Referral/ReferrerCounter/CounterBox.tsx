import { ReactNode } from 'react';

const UserCounterBox = ({
  icon,
  title,
  count,
}: {
  icon: ReactNode;
  title: string;
  count: number;
}) => (
  <div className="flex flex-nowrap gap-8">
    <div className="grid aspect-square w-[64px] place-items-center rounded-full bg-bgcolor">
      {icon}
    </div>
    <div className="flex flex-col gap-2 font-poppins">
      <h6 className="whitespace-nowrap text-sm font-normal text-white">
        {title}
      </h6>
      <p className="text-sm text-white/70">
        <strong className="mr-2 text-2xl font-bold text-white">
          {count.toLocaleString()}
        </strong>
        user
      </p>
    </div>
  </div>
);
export default UserCounterBox;
