export interface BackTestBenchmark {
  gold_benchmark: BackTestDateValue[];
  sp500_benchmark: BackTestDateValue[];
  btc_benchmark: BackTestDateValue[];
  etf_benchmark: BackTestDateValue[];
}

export interface BackTestDateValue {
  d: string;
  v: number;
}
