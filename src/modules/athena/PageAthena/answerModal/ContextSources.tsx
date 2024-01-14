import { useTranslation } from 'react-i18next';
import { useAthena } from 'modules/athena/core';
import resourcesIcon from '../images/resources.svg';

export const ContextSources = () => {
  const { t } = useTranslation('athena');
  const { terminationData } = useAthena();

  if (!terminationData?.context_sources.length) return null;

  const data = [...terminationData.context_sources];
  const theFirstFive = data.splice(0, 5);

  return (
    <section className="border-t border-white/30 pt-8">
      <p className="mb-4 flex items-center gap-4 text-xl text-white/50">
        <img src={resourcesIcon} alt="resources" /> {t('resources')}
      </p>
      <section className="grid grid-cols-3 gap-3 mobile:grid-cols-2">
        {theFirstFive.map((item, i) => {
          const hostname = new URL(item.url).hostname;
          const hostSplit = hostname.split('.');
          const name = hostSplit[0] === 'www' ? hostSplit[1] : hostSplit[0];
          return (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              className="flex flex-col justify-between gap-1 rounded-xl border border-white/30 bg-transparent p-2 text-base capitalize transition-colors hover:bg-white/10"
              rel="noreferrer"
            >
              <p className="line-clamp-2 text-xs font-light text-white/90">
                {item.description}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-light text-white/70">
                <img
                  alt="icon"
                  className="h-3 w-3 rounded-full"
                  src={`http://www.google.com/s2/favicons?sz=64&domain=${hostname}`}
                />
                {name}
                <div className="h-1 w-1 rounded-full bg-white/70" />
                {i + 1}
              </div>
            </a>
          );
        })}
        {data.length > 0 && (
          <div className="flex items-center justify-center rounded-xl border border-white/30 text-xs font-light text-white/80">
            + {data.length} {t('other-sources')}
          </div>
        )}
      </section>
    </section>
  );
};
