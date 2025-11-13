/* eslint-disable import/no-unassigned-import */
import { type FC, type ReactNode, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './slides.css';
import { ReactComponent as Logo } from 'assets/logo-green.svg';
import { clsx } from 'clsx';
import discoverImg from './images/discover.png';
import gradientBg from './images/gradient-bg.png';
import instantImg from './images/instant.png';
import metaImg from './images/meta.png';
import tradeImg from './images/trade.png';

const useModalLoginImages = () => {
  return useMemo<
    Array<{
      src: string;
      floatSrc?: string;
      title: ReactNode;
      subtitle: ReactNode;
    }>
  >(
    () => [
      {
        src: discoverImg,
        title: <Trans i18nKey="login.images.discover.title" ns="auth" />,
        subtitle: <Trans i18nKey="login.images.discover.subtitle" ns="auth" />,
      },
      {
        src: metaImg,
        title: <Trans i18nKey="login.images.validate.title" ns="auth" />,
        subtitle: <Trans i18nKey="login.images.validate.subtitle" ns="auth" />,
      },
      {
        src: tradeImg,
        floatSrc: instantImg,
        title: <Trans i18nKey="login.images.trade.title" ns="auth" />,
        subtitle: <Trans i18nKey="login.images.trade.subtitle" ns="auth" />,
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
      allowTouchMove
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        stopOnLastSlide: false,
        waitForTransition: false,
      }}
      className={clsx(
        'login-slides',
        '[&_.swiper-pagination-bullet]:!mx-px [&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet]:opacity-70 [&_.swiper-pagination-bullet]:shadow [&_.swiper-pagination-bullet]:transition-all',
        '[&_.swiper-pagination-bullet-active]:!w-5 [&_.swiper-pagination-bullet-active]:!rounded-xl [&_.swiper-pagination-bullet-active]:!bg-v1-background-brand',
        className,
      )}
      loop
      modules={[Pagination, Autoplay]}
      pagination={{
        enabled: true,
        clickable: true,
      }}
      slidesPerView={1}
    >
      {images.map(img => (
        <SwiperSlide
          className={clsx(
            'relative h-full w-full overflow-hidden text-center',
            '[&.swiper-slide-active_img]:translate-y-0 [&.swiper-slide-active_img]:scale-100 [&_img]:transition-all [&_img]:duration-700 [&_img]:will-change-transform',
            '[&.swiper-slide-active_h3]:translate-y-0 [&_h3]:transition-all [&_h3]:duration-700 [&_h3]:will-change-transform',
            '[&.swiper-slide-active_p]:scale-100 [&_p]:opacity-100 [&_p]:transition-all [&_p]:duration-700 [&_p]:will-change-transform',
            '[&.swiper-slide-active_span]:opacity-100 [&_span]:transition-all [&_span]:duration-[1200ms] [&_span]:will-change-transform',
          )}
          key={img.src}
        >
          <img alt="" className="absolute bottom-0 w-full" src={gradientBg} />
          <div className="flex h-full max-h-full flex-col items-center justify-between overflow-hidden px-8">
            <div className="flex mobile:min-h-52 w-full flex-col items-center gap-3 py-8 mobile:pb-3">
              <Logo className="h-8 md:hidden" />
              <h3 className="-translate-y-4 font-semibold text-2xl [&_b]:bg-brand-gradient [&_b]:bg-clip-text [&_b]:font-bold [&_b]:text-transparent">
                {img.title}
              </h3>
              <p className="scale-x-125 text-sm text-v1-content-primary/70 opacity-0">
                {img.subtitle}
              </p>
            </div>
            <div className="relative w-[94%]">
              <img
                alt=""
                className="h-full grow translate-y-10 scale-90 object-contain object-bottom"
                src={img.src}
              />
              {img.floatSrc && (
                <img
                  alt=""
                  className="-top-5 -translate-x-1/2 absolute left-1/2 w-[85%]"
                  src={img.floatSrc}
                />
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
