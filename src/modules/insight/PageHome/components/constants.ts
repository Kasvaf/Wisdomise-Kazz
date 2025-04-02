import { type ComponentProps } from 'react';
import { type AccessShield } from 'shared/AccessShield';

export const homeSubscriptionsConfig: ComponentProps<
  typeof AccessShield
>['sizes'] = {
  'guest': true,
  'initial': 3,
  'free': 3,
  'pro': 3,
  'pro+': false,
  'pro_max': false,
};
