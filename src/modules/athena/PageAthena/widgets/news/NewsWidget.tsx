import { useRef, useState } from 'react';
import { type OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';
import { WidgetWrapper } from '../WidgetWrapper';
import newsIcon from './news.svg';
import { NewsContent } from './NewsContent';
import { useNewsQuery } from './useNewsQuery';

interface Props {
  limit?: number;
}

export default function NewsWidget({ limit = 10 }: Props) {
  const news = useNewsQuery(limit);
  const osRef = useRef<OverlayScrollbarsComponentRef>(null);
  const [currentOpenNews, setCurrentOpenNews] = useState('');
  const data = limit ? news.data?.slice(0, limit) : news.data;

  const onReadMoreLessClick = (id: string) => {
    const osInstance = osRef.current?.osInstance();
    const offsetTop = document.querySelector<HTMLDivElement>('#news-' + id)
      ?.offsetTop;
    if (!osInstance || offsetTop === undefined) return;

    const { scrollOffsetElement } = osInstance.elements();
    if (currentOpenNews === id) {
      setCurrentOpenNews('');
      scrollOffsetElement.scrollTo({ top: offsetTop });
    } else {
      setCurrentOpenNews(id);
    }
  };

  if (news.isLoading) {
    return null;
  }

  return (
    <WidgetWrapper
      scroll
      title="News"
      ref={osRef}
      iconSrc={newsIcon}
      poweredBy="wisdomise"
    >
      {data?.map(article => (
        <NewsContent
          data={article}
          key={article.link}
          open={article.id === currentOpenNews}
          onReadMoreLessClick={onReadMoreLessClick}
        />
      ))}
    </WidgetWrapper>
  );
}
