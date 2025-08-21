export function parseDur(dur: string) {
  const val = Number.parseInt(dur, 10);
  const d = new Date();
  switch (dur.replace(/\d+/, '')) {
    case 's': {
      d.setSeconds(d.getSeconds() + val);
      break;
    }
    case 'm': {
      d.setMinutes(d.getMinutes() + val);
      break;
    }
    case 'h': {
      d.setHours(d.getHours() + val);
      break;
    }
    case 'd': {
      d.setDate(d.getDate() + val);
      break;
    }
    case 'M': {
      d.setMonth(d.getMonth() + val);
      break;
    }
  }
  return d.toISOString();
}
