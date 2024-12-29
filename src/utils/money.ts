export function toBigMoney(
  src: number | string | bigint,
  decimals: number,
): bigint {
  const pow10 = 10n ** BigInt(decimals);
  if (typeof src === 'bigint') {
    return src * pow10;
  } else {
    if (typeof src === 'number') {
      if (!Number.isFinite(src)) {
        throw new TypeError('Invalid number');
      }

      if (Math.log10(src) <= 6) {
        src = src.toLocaleString('en', {
          minimumFractionDigits: decimals,
          useGrouping: false,
        });
      } else if (src - Math.trunc(src) === 0) {
        src = src.toLocaleString('en', {
          maximumFractionDigits: 0,
          useGrouping: false,
        });
      } else {
        throw new Error(
          'Not enough precision for a number value. Use string value instead',
        );
      }
    }

    // Check sign
    let neg = false;
    while (src.startsWith('-')) {
      neg = !neg;
      src = src.slice(1);
    }

    // Split string
    if (src === '.') {
      throw new Error('Invalid number');
    }
    const parts = src.split('.');
    if (parts.length > 2) {
      throw new Error('Invalid number');
    }

    // Prepare parts
    let whole = parts[0];
    let frac = parts[1];
    if (!whole) {
      whole = '0';
    }
    if (!frac) {
      frac = '0';
    }
    if (frac.length > decimals) {
      throw new Error('Invalid number');
    }
    while (frac.length < decimals) {
      frac += '0';
    }

    // Convert
    let r = BigInt(whole) * pow10 + BigInt(frac);
    if (neg) {
      r = -r;
    }
    return r;
  }
}

export function fromBigMoney(src: bigint | number | string, decimals: number) {
  const pow10 = 10n ** BigInt(decimals);

  let v = BigInt(src);
  let neg = false;
  if (v < 0) {
    neg = true;
    v = -v;
  }

  // Convert fraction
  const frac = v % pow10;
  let facStr = frac.toString();
  while (facStr.length < decimals) {
    facStr = '0' + facStr;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  facStr = facStr.match(/^(\d*[1-9]|0)(0*)/)![1];

  // Convert whole
  const whole = v / pow10;
  const wholeStr = whole.toString();

  // Value
  let value = `${wholeStr}${facStr === '0' ? '' : `.${facStr}`}`;
  if (neg) {
    value = '-' + value;
  }

  return value;
}
