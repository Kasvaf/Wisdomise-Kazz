import { useAccountQuery } from 'api';

const ATHENA_TELEGRAM_BOT = import.meta.env.VITE_ATHENA_BOT_BASE_URL as string;

const useTelegramAddress = () => {
  const account = useAccountQuery();
  const code = account.data?.telegram_code;
  return code ? `${ATHENA_TELEGRAM_BOT}?start=${code}` : ATHENA_TELEGRAM_BOT;
};

export default useTelegramAddress;
