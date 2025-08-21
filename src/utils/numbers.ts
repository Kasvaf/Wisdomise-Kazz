import type React from 'react';

export const roundDown = (number: number, decimals = 2) => {
  const tens = 10 ** (decimals | 0);
  return Math.floor(number * tens) / tens;
};

export const roundSensible = (value: number | string | null | undefined) => {
  const val = Number(value);
  if (Number.isNaN(val)) {
    return String(value);
  }

  return val
    .toFixed(val > -1 && val < 1 ? 18 : 5)
    .replace(/(\.0*\d{5})\d*/, '$1')
    .replaceAll(/\.?0+$/g, '');
};

export function toSignificantDigits(num: number, digits: number): number {
  if (num === 0) return 0; // Handle zero case

  const magnitude = Math.floor(Math.log10(Math.abs(num))) + 1;
  const factor = 10 ** (digits - magnitude);

  return Math.round(num * factor) / factor;
}

export const addComma = (number?: number | bigint) =>
  number?.toLocaleString() ?? 0;

const resolvePower = (number: number) => {
  const strNumber = number.toString();
  const ePosition = strNumber.search(/(e|E).+$/g);
  if (ePosition === -1) return number.toString();
  const positiveFloatLength = strNumber
    .slice(0, ePosition - 1)
    .replace('.', '').length;
  const ePower = ePosition === -1 ? 0 : +strNumber.slice(ePosition + 1);
  if (ePower < 0) return number.toFixed(Math.abs(ePower) + positiveFloatLength);
  return number.toLocaleString('en-US').replaceAll(',', '');
};

export const compressByLabel = (number: number) => {
  let label = '';
  let value = '';
  const positiveNumber = Math.abs(number);
  if (positiveNumber > 1e3 - 1) {
    const sectors = [
      { label: 'K', max: 1e6, divide: 1e3 },
      { label: 'M', max: 1e9, divide: 1e6 },
      { label: 'B', max: 1e12, divide: 1e9 },
      { label: 'T', max: 1e15, divide: 1e12 },
      { label: 'Qa', max: 1e18, divide: 1e15 },
      { label: 'Qi', max: 1e21, divide: 1e18 },
      { label: 'Sx', max: 1e24, divide: 1e21 },
      { label: 'Sp', max: 1e27, divide: 1e24 },
      { label: 'Oc', max: Number.POSITIVE_INFINITY, divide: 1e27 },
    ];
    for (const sector of sectors) {
      if (positiveNumber < sector.max) {
        const [intPart, decPart] = resolvePower(number / sector.divide).split(
          '.',
        );
        label = sector.label;
        value = `${intPart}${decPart ? `.${decPart}` : ''}`;
        break;
      }
    }
  }
  return {
    value: `${value || resolvePower(number)}`,
    label,
  };
};

const cutEndOfNumber = (decimalStr: string, length: number, exact = false) => {
  let value = decimalStr;
  if (length < 0 || !decimalStr) return value;
  if (length < Number.POSITIVE_INFINITY) {
    const numStrs = [...decimalStr];
    const firstNonZeroIndex = exact
      ? 0
      : numStrs.findIndex(numStr => numStr !== '0');
    value = decimalStr.slice(0, firstNonZeroIndex + length);
  }
  return value.replaceAll(/0*$/g, '');
};

const minifyNumberRepeats = (numbStr: string) => {
  let zeroLength = 0;
  let output = '';
  for (const char of numbStr) {
    if (char === '0') {
      zeroLength += 1;
    } else {
      if (zeroLength > 0) {
        output +=
          zeroLength <= 2
            ? '0'.repeat(zeroLength)
            : `0₍${zeroLength
                .toString()
                .replaceAll(/\d/g, n => '₀₁₂₃₄₅₆₇₈₉'[+n])}₎`;
        zeroLength = 0;
      }
      output += char;
    }
  }
  return output;
};

export interface FormatNumberOptions {
  compactInteger: boolean; /// If true: 1520000 => 1.52M
  separateByComma: boolean; // If true: 1234 => 1,234
  decimalLength: number; // If 2: 2.001234 => 2.0012, 2.120 => 2.12, 2.100 => 2.1
  minifyDecimalRepeats: boolean; // If true: 1.1000002 => 1.10₍₅₎2
  exactDecimal?: boolean;
}
export const formatNumber = (input: number, options: FormatNumberOptions) => {
  let output = {
    integerPart: '',
    decimalPart: '',
    label: '',
  };
  if (options.compactInteger) {
    const { label, value } = compressByLabel(input);
    const [integerPart = '', decimalPart = ''] = value.split('.');
    output = {
      label,
      integerPart,
      decimalPart,
    };
  } else {
    const [integerPart = '', decimalPart = ''] = resolvePower(input).split('.');
    output = {
      label: '',
      integerPart,
      decimalPart,
    };
  }

  // Dividing integer by comma
  if (options.separateByComma) {
    output = {
      ...output,
      integerPart: output.integerPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ','),
    };
  }

  // Cutting unnecessary decimal
  output = {
    ...output,
    decimalPart: cutEndOfNumber(
      output.decimalPart,
      options.decimalLength,
      options.exactDecimal,
    ),
  };

  // Minify decimal
  if (options.minifyDecimalRepeats) {
    output = {
      ...output,
      decimalPart: minifyNumberRepeats(output.decimalPart),
    };
  }

  return [
    `${output.integerPart}${
      output.decimalPart ? `.${output.decimalPart}` : ''
    }`,
    output.label,
  ]
    .filter(x => !!x)
    .join(' ');
};

export const preventNonNumericInput = (e: React.KeyboardEvent) => {
  if (Number.isNaN(+e.key) && e.key !== 'Backspace' && e.key !== '.') {
    e.preventDefault();
  }
};
