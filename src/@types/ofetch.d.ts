// eslint-disable-next-line import/no-unassigned-import
import 'ofetch';

interface OfetchRequestMeta {
  auth?: boolean;
  lang?: boolean;
}

// Merge the FetchOptions from ofetch with the meta property
declare module 'ofetch' {
  export interface FetchOptions {
    meta?: OfetchRequestMeta;
  }
}
