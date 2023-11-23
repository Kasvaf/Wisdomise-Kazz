import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useProtocolTvlHistory } from 'api/staking';
import useProtocolInfo from '../useProtocolInfo';
import { ReactComponent as DocsIcon } from '../images/docs.svg';
import { ReactComponent as GithubIcon } from '../images/github.svg';
import { ReactComponent as WebsiteIcon } from '../images/website.svg';
import { ReactComponent as XIcon } from '../images/x.svg';
import AreaChart from '../AreaChart';

export default function ProtocolInfo() {
  const { data } = useProtocolInfo();
  const params = useParams<{ id: string }>();
  const { t } = useTranslation('staking');
  const tvlHistory = useProtocolTvlHistory(params.id);

  if (!data) return null;

  return (
    <div className="flex h-full flex-col justify-between mobile:gap-4 mobile:border-b mobile:border-white/20 mobile:pb-4">
      <div className="flex gap-3">
        <img src={data.logo_url} className="h-11 rounded-full" />
        <p className="text-xl font-semibold leading-none">
          {data.name}
          <br />
          <span className="text-sm text-white/40">{data.defi_symbol.name}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {[
          ['TVL', '$' + data.tvl_usd.toLocaleString()],
          ['Token', data.defi_symbol.symbol],
          ['Audit', data.audits],
        ].map(row => (
          <div key={row[0]} className="flex w-full justify-between">
            <p className="text-sm font-medium text-white/40">{row[0]}</p>
            <p className="font-bold text-white">{row[1]}</p>
          </div>
        ))}
        <hr className="mx-4 border-white/20" />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-white/40">
          {t('info.description')}
        </p>
        <p className="text-xs text-white/80">{data.description}</p>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-white/40">
          {t('info.project-links')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: DocsIcon, title: t('info.docs'), url: data.docs_url },
            {
              icon: WebsiteIcon,
              title: t('info.website'),
              url: data.website_url,
            },
            { icon: XIcon, title: t('info.twitter'), url: data.twitter_url },
            { icon: GithubIcon, title: t('info.github'), url: data.github_url },
          ].map(row => (
            <a
              target="_blank"
              href={row.url}
              key={row.title}
              rel="noreferrer"
              className="flex items-center justify-start gap-3 rounded-lg bg-white/5 p-2 pl-5"
            >
              <row.icon />
              <span className="text-xs font-bold">{row.title}</span>
            </a>
          ))}
        </div>
      </div>

      <AreaChart
        yField="tvl"
        xField="date"
        title={t('info.chart.tvl-history')}
        data={tvlHistory.data || []}
      />
    </div>
  );
}
