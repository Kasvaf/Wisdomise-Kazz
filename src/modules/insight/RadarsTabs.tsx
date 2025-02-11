import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonSelect } from 'shared/ButtonSelect';
import useIsMobile from 'utils/useIsMobile';

const RadarsTabs = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <div className="h-12">
      <div className="fixed inset-x-0 top-20 z-10 flex items-center">
        <div className="mx-auto min-w-[calc(100%-1.5rem)] bg-v1-surface-l1 pb-2">
          <ButtonSelect
            value={pathname}
            onChange={newValue => navigate(newValue)}
            options={[
              {
                label: 'Social Radar',
                value: '/coin-radar/social-radar',
              },
              {
                label: 'Technical Radar',
                value: '/coin-radar/technical-radar',
              },
              {
                label: 'Whale Radar',
                value: '/coin-radar/whale-radar',
              },
            ]}
            className="w-full"
            itemsClassName="!text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default RadarsTabs;
