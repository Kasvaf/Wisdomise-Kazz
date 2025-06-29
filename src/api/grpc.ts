/* eslint-disable react-hooks/rules-of-hooks */
import { createServiceSingleton } from './grpc-utils';

export const networkRadarGrpc = createServiceSingleton('network-radar');
export const delphinusGrpc = createServiceSingleton('delphinus');
export const pingGrpc = createServiceSingleton('ping');
