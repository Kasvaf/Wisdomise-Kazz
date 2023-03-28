import { FunctionComponent, ReactNode } from 'react';
// import Spinner from 'components/common/Spinner';
import { ReactComponent as FolderIcon } from '@images/icons/folder.svg';
import Spinner from 'components/spinner';

interface DataRendererProps {
  data: Array<unknown>;
  view: ReactNode;
  message?: string;
  isLoading?: boolean;
  pulsation?: boolean;
}

const noData = (message?: string) => (
  <div className="flex h-32 flex-col items-center justify-center space-y-4 text-nodata md:h-64">
    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-primary/10 fill-primary">
      <FolderIcon />
    </div>
    <span>{message || 'No data found'}</span>
  </div>
);

export const DataRenderer: FunctionComponent<DataRendererProps> = ({
  data,
  view,
  message,
  isLoading,
  pulsation,
}) => (
  <>
    <>
      {(isLoading || !data) &&
        (pulsation ? (
          <div
            className={`dashboard-panel } mb-8 flex h-[20rem] flex-col items-center
            justify-center md:h-auto`}
          >
            <div>
              <Spinner />
              <div className="mt-8 text-center text-xl text-white">
                Scanning
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row justify-center">
            <Spinner />
          </div>
        ))}
      {!isLoading && data && (
        <>
          {!data.length && noData(message)}
          {!!data.length && view}
        </>
      )}
    </>
  </>
);

export default DataRenderer;
