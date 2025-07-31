import { roundSensible } from 'utils/numbers';

export const convertToBaseAmount = (
  amount: string,
  amountType: 'percentage' | 'base' | 'quote',
  baseBalance?: number | null,
  priceByOther?: number | null,
) => {
  if (amountType === 'percentage')
    return roundSensible(
      amount === '100' ? baseBalance : ((baseBalance ?? 0) * +amount) / 100,
    );
  else if (amountType === 'base') {
    return amount;
  } else {
    return roundSensible((priceByOther ?? 0) * +amount);
  }
};
