import type { ComponentProps } from 'react';
import type { AccessShield } from 'shared/AccessShield';

export const homeSubscriptionsConfig: ComponentProps<
  typeof AccessShield
>['sizes'] = {
  guest: false,
  initial: false,
  free: false,
  vip: false,
};
