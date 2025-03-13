import { type ComponentProps } from 'react';
import { type AccessShield } from 'shared/AccessShield';

export const homeSubscriptionsConfig: ComponentProps<
  typeof AccessShield
>['sizes'] = {
  'guest': true,
  'initial': true,
  'free': true,
  'pro': 3,
  'pro+': false,
  'pro_max': false,
};
