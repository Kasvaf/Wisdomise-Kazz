/* eslint-disable import/no-unassigned-import */
import { type FC, type ReactNode, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
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
      className={className}
      allowTouchMove
      loop
      navigation
      slidesPerView={1}
      pagination
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
            'relative h-full w-full overflow-hidden rounded-3xl px-8 text-center',
            '[&.swiper-slide-active_*]:translate-y-0 [&.swiper-slide-active_*]:scale-100 [&.swiper-slide-active_*]:opacity-100 [&.swiper-slide-active_*]:grayscale-0 [&_*]:transition-all [&_*]:duration-700 [&_*]:will-change-transform',
          )}
        >
          <div className="absolute bottom-[-20%] left-[15%] size-[70%] bg-wsdm-gradient opacity-0 blur-[70px]" />
          <img
            src={img.src}
            className="absolute bottom-[-1%] left-[12%] max-h-[80%] w-[76%] translate-y-10 scale-95 object-contain mobile:bottom-[-5%] mobile:left-[7%] mobile:w-[86%]"
          />
          <h3 className="relative m-0 -translate-y-4 bg-gradient-to-b from-v1-surface-l1 to-transparent pt-12 text-2xl font-bold grayscale mobile:pt-6 [&_b]:bg-wsdm-gradient [&_b]:bg-clip-text [&_b]:font-bold [&_b]:text-transparent">
            {img.title}
          </h3>
          <p className="relative m-0 scale-x-125 py-2 text-sm font-medium opacity-0">
            {img.subtitle}
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
