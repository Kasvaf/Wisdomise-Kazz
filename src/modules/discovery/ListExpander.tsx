import { bxChevronLeft, bxChevronRight } from 'boxicons-quasar';
import {
  type CSSProperties,
  useState,
  type FC,
  useRef,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { useDiscoveryRouteMeta } from './useDiscoveryRouteMeta';

export const ListExpander: FC = () => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const { params, getUrl } = useDiscoveryRouteMeta();
  const [style, setStyle] = useState<CSSProperties>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobile) return;

    const sidebarRect = document
      .querySelector('#sidebar')
      ?.getBoundingClientRect();
    const appListRect = document
      .querySelector('#app-list')
      ?.getBoundingClientRect();

    if (params.view === 'detail') {
      setStyle({
        top: (sidebarRect?.top ?? 74) + 32,
        left: (sidebarRect?.width ?? 68) - 12,
        position: 'fixed',
      });
    } else if (params.view === 'both') {
      setStyle({
        top: (sidebarRect?.top ?? 74) + 32,
        left: (appListRect?.left ?? 68) + (appListRect?.width ?? 384) - 12,
        position: 'fixed',
      });
    } else {
      setStyle({
        top: (sidebarRect?.top ?? 74) + 32,
        right: 6,
        position: 'fixed',
      });
    }
  }, [params, isMobile]);

  if (isMobile) return null;

  const handleExpandClick = () => {
    if (params.view === 'detail') {
      navigate(
        getUrl({
          view: 'both',
        }),
      );
    } else if (params.view === 'both') {
      navigate(
        getUrl({
          view: 'list',
        }),
      );
    }
  };

  const handleCollapseClick = () => {
    if (params.view === 'list') {
      navigate(
        getUrl({
          view: 'both',
        }),
      );
    } else if (params.view === 'both') {
      navigate(
        getUrl({
          view: 'detail',
        }),
      );
    }
  };

  return (
    <div
      className="fixed z-30 flex flex-col items-center gap-1"
      ref={ref}
      style={style}
    >
      {(params.view === 'detail' || params.view === 'both') && (
        <Button
          fab
          variant="white"
          size="3xs"
          className="rounded-full"
          onClick={handleExpandClick}
        >
          <Icon name={bxChevronRight} />
        </Button>
      )}
      {params.view !== 'detail' && params.slug && (
        <Button
          fab
          variant="white"
          size="3xs"
          className="rounded-full"
          onClick={handleCollapseClick}
        >
          <Icon name={bxChevronLeft} />
        </Button>
      )}
    </div>
  );
};
