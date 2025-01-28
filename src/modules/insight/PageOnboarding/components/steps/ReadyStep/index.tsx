import { useState } from 'react';
// import YouTube from 'react-youtube';
import YouTube from 'react-youtube';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { NavigateButtons } from '../../NavigateButtons';
import { StepContent } from '../../StepContent';

const useApprochVideos = (value: string[]) => {
  return [
    {
      value: 'social-radar',
      title: 'Social Radar',
      video: 'xF-AJ7ExA1Y',
    },
    {
      value: 'whale-radar',
      title: 'Whale Radar',
      video: 'G3D3390QRpQ',
    },
    {
      value: 'technical-radar',
      title: 'Technical Radar',
      video: 'FGxNEYECZgs',
    },
  ].filter(x => value.includes(x.value));
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
  const videos = useApprochVideos(value);
  const { video: selectedVideo } =
    videos.find(x => x.value === tab) ?? videos[0];
  return (
    <>
      <StepContent className="flex flex-col items-center justify-center">
        {videos.length > 1 && (
          <>
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
              options={videos.map(x => ({
                label: x.title,
                value: x.value,
              }))}
            />
          </>
        )}
        <YouTube
          videoId={selectedVideo}
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
