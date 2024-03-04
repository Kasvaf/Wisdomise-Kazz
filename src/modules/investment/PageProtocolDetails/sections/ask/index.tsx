import { clsx } from 'clsx';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAthena } from 'modules/athena/core';
import { ReactComponent as AthenaIcon } from '../../images/athena.svg';
import useProtocolInfo from '../../useProtocolInfo';
import QuestionPool from './QuestionPool';
import AskInput from './AskInput';

export default function AskSection() {
  const info = useProtocolInfo();
  const { t } = useTranslation('staking');
  const { answer, isLoading, question } = useAthena();

  return (
    <div>
      <div className="flex mobile:flex-col">
        <div className="shrink-0 grow-0 basis-1/3 p-4 mobile:order-2 mobile:px-0 mobile:pb-0">
          <QuestionPool />
        </div>
        <div className="shrink-0 grow-0 basis-2/3 mobile:order-1">
          <div className="flex gap-2">
            <AthenaIcon className="mb-6" />
            <p className="font-semibold leading-none">
              {t('ask.athena')}
              <br />
              <span className="text-xs text-white/60">
                {t('ask.athena-subtitle')}
              </span>
            </p>
          </div>
          <div
            className={clsx(
              'h-[450px] overflow-auto text-sm text-white/80',
              isLoading && 'flex items-center justify-center',
            )}
          >
            {isLoading && <Spin />}
            {!question && info.data?.athena_opening}
            <div
              dangerouslySetInnerHTML={{
                __html: answer.replaceAll('<br><br>', '<br/><br/>'),
              }}
            />
          </div>
        </div>
      </div>
      <AskInput />
    </div>
  );
}
