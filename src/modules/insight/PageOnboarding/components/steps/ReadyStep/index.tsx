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
      video: 'xF-AJ7ExA1Y',
    },
    {
      value: 'whale-radar',
      video: 'G3D3390QRpQ',
    },
    {
      value: 'technical-radar',
      video: 'FGxNEYECZgs',
    },
  ];
};

export function ReadyStep({
  value,
  onNext,
  onPrev,
}: {
  value: string[];
  onNext?: (url: string) => void;
  onPrev?: () => void;
}) {
  const [tab, setTab] = useState(value[0] ?? 'social-radar');
  const videos = useApprochVideos();
  const { video } = videos.find(x => x.value === tab) ?? videos[0];
  return (
    <>
      <StepContent className="flex flex-col items-center justify-center">
        <h2 className="mb-5 text-xl mobile:text-lg">
          {'How Do You Want to Get Started?'}
        </h2>
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
        <YouTube
          videoId={video}
          className="mx-auto h-[300px] w-full max-w-4xl overflow-hidden rounded-lg bg-v1-surface-l2 md:h-[500px] 2xl:h-[536px]"
          iframeClassName="size-full"
        />
      </StepContent>
      <NavigateButtons
        nextText="Get Started"
        prevText="Previous"
        onNext={() =>
          onNext?.(
            tab === 'social-radar'
              ? '/coin-radar/social-radar'
              : tab === 'technical-radar'
              ? '/coin-radar/technical-radar'
              : '/coin-radar/whale-radar',
          )
        }
        onPrev={onPrev}
      />
    </>
  );
}
