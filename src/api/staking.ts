import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CHATAPP_ORIGIN, TEMPLE_ORIGIN } from 'config/constants';

interface ProtocolInfo {
  name: string;
  defi_symbol: {
    symbol: string;
    name: string;
  };
  logo_url: string;
  tvl_usd: number;
  audits: string;
  description: string;
  whitepaper_url: string;
  website_url: string;
  twitter_url: string;
  github_url: string;
  docs_url: string;
  athena_opening: string;
}

export const useProtocolInfoQuery = (id?: string) =>
  useQuery(['protocol', id], async () => {
    const { data } = await axios.get<ProtocolInfo>(
      `${TEMPLE_ORIGIN}/api/v1/delphi/protocols/${id ?? ''}`,
    );
    return data;
  });

export interface ProtocolPools {
  page_size: number;
  count: number;
  previous: null;
  results: {
    protocol_name: string;
    pool: Array<{
      key: string;
      apy: number;
      chain: string;
      url?: string;
      tvl_usd: number;
      apy_base: number;
      apy_reward?: number;
      defi_symbols: Array<{ symbol: string; name: string }>;
    }>;
  };
}

export const useProtocolPoolsQuery = (
  id: string,
  filters: { search?: string; page: number; sort?: string },
) =>
  useQuery(
    ['protocolPools', id, filters],
    async ({ signal }) => {
      const { page, search, sort } = filters;
      const params = new URLSearchParams();
      sort && params.set('ordering', sort);
      search && params.set('search', search);
      page && params.set('page', page.toString());
      const { data } = await axios.get<ProtocolPools>(
        `${TEMPLE_ORIGIN}/api/v1/delphi/protocols/${
          id ?? ''
        }/pools?${params.toString()}`,
        { signal },
      );
      return data;
    },
    { keepPreviousData: true },
  );

interface DefiProjectsQuestionPool {
  key: string;
  name: string;
  title: string;
  children: Array<{
    key: string;
    name: string;
    title: string;
    template_questions: Array<{
      key: string;
      template_prompt: string;
      interface_prompt: string;
    }>;
  }>;
}

export const useDefiProjectsQuestionPool = () =>
  useQuery(
    ['defiProjectQuestionPool'],
    async () => {
      const { data } = await axios.get<DefiProjectsQuestionPool>(
        `${CHATAPP_ORIGIN}/api/template/question_pool/defi_projects_section_question_pool`,
      );
      return data;
    },
    { retry: false },
  );

interface ProtocolTvlHistory {
  name: string;
  data: Array<{ tvl: number; date: string }>;
}
export const useProtocolTvlHistory = (id?: string) =>
  useQuery(['protocolTvlHistory', id], async () => {
    const { data } = await axios.get<ProtocolTvlHistory>(
      `${TEMPLE_ORIGIN}/api/v1/delphi/protocols/${id ?? ''}/hist_tvl?res=7d`,
    );
    return data.data;
  });

export const usePoolTvlHistory = (id?: string) =>
  useQuery(['poolTvlHistory', id], async () => {
    const { data } = await axios.get<Array<{ tvl: number; date: string }>>(
      `${TEMPLE_ORIGIN}/api/v1/delphi/pools/${id ?? ''}/hist_tvl?res=7d`,
    );
    return data;
  });

export const usePoolApyHistory = (id?: string) =>
  useQuery(['poolApyHistory', id], async () => {
    const { data } = await axios.get<Array<{ tvl: number; date: string }>>(
      `${TEMPLE_ORIGIN}/api/v1/delphi/pools/${id ?? ''}/hist_apy?res=7d`,
    );
    return data;
  });
