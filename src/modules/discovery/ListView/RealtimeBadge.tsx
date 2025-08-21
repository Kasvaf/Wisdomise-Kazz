import type { FC } from 'react';
import { Badge } from 'shared/v1-components/Badge';

export const RealtimeBadge: FC<{ className?: string }> = ({ className }) => (
  <Badge className={className} ticking variant="positive">
    {'Realtime'}
  </Badge>
);
