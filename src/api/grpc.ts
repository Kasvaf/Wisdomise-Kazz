/* eslint-disable react-hooks/rules-of-hooks */
import { createServiceSingleton } from './grpc-utils';

export const delphinusGrpc = createServiceSingleton('delphinus');
