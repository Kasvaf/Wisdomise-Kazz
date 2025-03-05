/* eslint-disable import/no-unassigned-import */
import { type FC, type ReactNode, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './slides.css';
import { clsx } from 'clsx';
import discoverImg from './discover.png';
import validateImg from './validate.png';
import tradeImg from './trade.png';

const useModalLoginImages = () => {
  // const { pathname } = useLocation();
  return useMemo<
    Array<{
      src: string;
      title: ReactNode;
      subtitle: ReactNode;
    }>
  >(
    () => [
      {
        src: discoverImg,
        title: <Trans ns="auth" i18nKey="login.images.discover.title" />,
        subtitle: <Trans ns="auth" i18nKey="login.images.discover.subtitle" />,
      },
      {
        src: validateImg,
        title: <Trans ns="auth" i18nKey="login.images.validate.title" />,
        subtitle: <Trans ns="auth" i18nKey="login.images.validate.subtitle" />,
      },
      {
        src: tradeImg,
        title: <Trans ns="auth" i18nKey="login.images.trade.title" />,
        subtitle: <Trans ns="auth" i18nKey="login.images.trade.subtitle" />,
      },
    ],
    [],
  );
};

export const ModalLoginSlides: FC<{
  className?: string;
}> = ({ className }) => {
  const images = useModalLoginImages();

  return (
    <Swiper
      className={clsx(
        'login-slides',
        '[&_.swiper-pagination-bullet]:!mx-px [&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet]:opacity-70 [&_.swiper-pagination-bullet]:shadow [&_.swiper-pagination-bullet]:transition-all',
        '[&_.swiper-pagination-bullet-active]:!w-5 [&_.swiper-pagination-bullet-active]:!rounded-xl [&_.swiper-pagination-bullet-active]:!bg-v1-background-brand',
        className,
      )}
      allowTouchMove
      loop
      navigation
      slidesPerView={1}
      pagination={{
        enabled: true,
        clickable: true,
      }}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        stopOnLastSlide: false,
        waitForTransition: false,
      }}
    >
      {images.map(img => (
        <SwiperSlide
          key={img.src}
          className={clsx(
            'relative h-full w-full overflow-hidden rounded-3xl text-center',
            '[&.swiper-slide-active_img]:translate-y-0 [&.swiper-slide-active_img]:scale-100 [&_img]:transition-all [&_img]:duration-700 [&_img]:will-change-transform',
            '[&.swiper-slide-active_h3]:translate-y-0 [&_h3]:transition-all [&_h3]:duration-700 [&_h3]:will-change-transform',
            '[&.swiper-slide-active_p]:scale-100 [&_p]:opacity-100 [&_p]:transition-all [&_p]:duration-700 [&_p]:will-change-transform',
            '[&.swiper-slide-active_span]:opacity-100 [&_span]:transition-all [&_span]:duration-[1200ms] [&_span]:will-change-transform',
          )}
        >
          <span className="absolute bottom-[-20%] left-[15%] size-[70%] bg-wsdm-gradient opacity-0 blur-[70px]" />
          <div className="flex h-full max-h-full flex-col items-center justify-between overflow-hidden px-8">
            <div className="flex w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-v1-surface-l1 to-transparent py-8 mobile:pb-3">
              <h3 className="-translate-y-4 text-2xl font-bold [&_b]:bg-wsdm-gradient [&_b]:bg-clip-text [&_b]:font-bold [&_b]:text-transparent">
                {img.title}
              </h3>
              <p className="scale-x-125 text-sm font-medium opacity-0">
                {img.subtitle}
              </p>
            </div>
            <img
              src={img.src}
              className="h-full w-[94%] grow translate-y-10 scale-90 object-contain object-bottom"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
