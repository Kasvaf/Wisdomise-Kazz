import { bxSquare, bxX } from 'boxicons-quasar';
import clsx from 'clsx';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ReactDraggable, { type ControlPosition } from 'react-draggable';
import Icon from 'shared/Icon';
import { useSessionStorage } from 'usehooks-ts';
import { type Surface, useSurface } from 'utils/useSurface';
import { Button } from '../Button';
import { ReactComponent as DragIcon } from './drag.svg';

export type DraggableProps = {
  id: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maximizable?: boolean;
  onMaximize?: () => void;
  closable?: boolean;
  onClose?: () => void;
  surface?: Surface;
};

export function Draggable({
  id,
  header,
  children,
  className,
  closable = false,
  onClose,
  maximizable = false,
  onMaximize,
  surface = 1,
}: DraggableProps) {
  const colors = useSurface(surface);

  const getHighestZIndex = () =>
    Math.max(
      ...[
        ...document.querySelectorAll<HTMLDivElement>('.id-draggable-element'),
      ].map(x => (+x.style.zIndex || 0) + 1),
      500,
    );

  const [isMoving, setIsMoving] = useState(false);
  const [zIndex, setZIndex] = useState(getHighestZIndex());

  // position
  const [pos, setPos] = useSessionStorage<ControlPosition | undefined>(
    `draggable-pos-${id}`,
    {
      x: (window.innerWidth + Math.random() * 150) / 4,
      y: (window.innerHeight + Math.random() * 150) / 4,
    },
  );

  return createPortal(
    <>
      {isMoving && (
        <div
          className="fixed inset-0"
          style={{
            zIndex,
          }}
        />
      )}
      <ReactDraggable
        bounds="body"
        defaultPosition={pos}
        handle={`#drag-header-${id}`}
        key={id}
        onStart={() => {
          setIsMoving(true);
          setZIndex(getHighestZIndex());
        }}
        onStop={(_, data) => {
          setIsMoving(false);
          setPos({ x: data.x, y: data.y });
        }}
      >
        <div
          className={clsx(
            'id-draggable-element',
            'fixed top-0 left-0 flex flex-col items-stretch justify-stretch overflow-hidden rounded-xl border border-white/10 shadow-xl',
            className,
            isMoving && 'opacity-75',
          )}
          onPointerDown={() => setZIndex(getHighestZIndex())}
          style={{
            zIndex,
            backgroundColor: colors.current,
            ['--content-height' as never]: '100%',
          }}
        >
          <div
            className="flex shrink-0 cursor-move select-none items-center justify-between gap-2 border-white/10 border-b px-3 py-2 text-xs"
            id={`drag-header-${id}`}
          >
            <DragIcon className="-translate-x-1/2 absolute top-1 left-1/2 size-3" />
            <div className="flex grow items-center justify-start gap-2">
              {header}
            </div>
            {maximizable && (
              <Button
                className="-me-1 text-v1-content-secondary"
                fab
                onClick={e => {
                  e.stopPropagation();
                  onMaximize?.();
                }}
                size="2xs"
                surface={1}
                variant="ghost"
              >
                <Icon className="[&>svg]:size-[14px]" name={bxSquare} />
              </Button>
            )}
            {closable && (
              <Button
                className="text-v1-content-secondary"
                fab
                onClick={e => {
                  e.stopPropagation();
                  onClose?.();
                }}
                size="2xs"
                surface={1}
                variant="ghost"
              >
                <Icon name={bxX} />
              </Button>
            )}
          </div>

          <div className="size-full shrink grow overflow-visible">
            {children}
          </div>
        </div>
      </ReactDraggable>
    </>,
    document.body,
  );
}
