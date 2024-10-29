// eslint-disable-next-line import/no-unassigned-import
import 'axios';

interface AxiosRequestMeta {
  auth?: boolean;
}

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    meta?: AxiosRequestMeta;
  }

  export interface AxiosRequestConfig<_D = any> {
    meta?: AxiosRequestMeta;
  }
}
