import { useState } from 'react';
// import YouTube from 'react-youtube';
import YouTube from 'react-youtube';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { NavigateButtons } from '../../NavigateButtons';
import { StepContent } from '../../StepContent';

const useApprochVideos = () => {
  return [
    {
      value: 'social-radar',
      video: 'dQw4w9WgXcQ' /* NAITODO */,
    },
    {
      value: 'whale-radar',
      video: 'dQw4w9WgXcQ' /* NAITODO */,
    },
    {
      value: 'technical-radar',
      video: 'dQw4w9WgXcQ' /* NAITODO */,
    },
  ];
};

export function ReadyStep({
  value,
  onNext,
  onPrev,
}: {
  value: string[];
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const [tab, setTab] = useState(value[0] ?? 'social-radar');
  const videos = useApprochVideos();
  const { video } = videos.find(x => x.value === tab) ?? videos[0];
  return (
    <>
      <StepContent>
        <ButtonSelect
          value={tab}
          onChange={setTab}
          className="mx-auto mb-6 w-full max-w-full !bg-black/30 md:max-w-min"
          buttonClassName="md:px-6 px-inherit"
          size="xl"
          variant="primary"
          options={[
            {
              label: 'Social Radar',
              value: 'social-radar',
              hidden: !value.includes('social-radar'),
            },
            {
              label: 'Whale Radar',
              value: 'whale-radar',
              hidden: !value.includes('whale-radar'),
            },
            {
              label: 'Technical Radar',
              value: 'technical-radar',
              hidden: !value.includes('technical-radar'),
            },
          ]}
        />
        <div className="h-[300px] w-full rounded-lg bg-v1-surface-l2 md:h-[512px] xl:h-[566px]">
          <YouTube videoId={video} className="h-full w-full" />
        </div>
      </StepContent>
      <NavigateButtons
        nextText="~Discover a Token Now"
        prevText="~Previous"
        onNext={onNext}
        onPrev={onPrev}
      />
    </>
  );
}
