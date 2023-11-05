import { useParams } from 'react-router-dom';
import { useProtocolInfoQuery } from 'api/staking';

export default function useProtocolInfo() {
  const params = useParams<{ id: string }>();
  return useProtocolInfoQuery(params.id);
}
