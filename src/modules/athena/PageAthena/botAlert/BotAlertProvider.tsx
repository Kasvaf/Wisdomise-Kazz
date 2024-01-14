import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import botIcon from '../images/botIcon.svg';
import closeIcon from '../images/closeAthena.svg';

export const BotAlertProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<BotAlertMessage>();

  return (
    <BotAlertContext.Provider value={{ alert, setAlert, open, setOpen }}>
      {children}

      <div
        className={clsx(
          'min-[1416px]:left-[calc(50vw-700px)] absolute bottom-0 left-0 z-30 opacity-100',
          'mobile:fixed mobile:bottom-0 mobile:left-0',
          !open && 'hidden',
        )}
      >
        <div
          className={clsx(
            'relative flex max-w-[600px] items-stretch gap-8 rounded-3xl bg-[#2b2f36] px-7 py-6',
            'mobile:w-screen mobile:flex-col mobile:gap-4 mobile:rounded-b-none',
          )}
        >
          <div className="flex shrink-0 grow-0 basis-20 flex-col items-center justify-between mobile:flex-row-reverse mobile:[&>img]:w-12">
            <img alt="bot" src={botIcon} className="w-11" />
            <img
              alt="close"
              src={closeIcon}
              onClick={() => setOpen(false)}
              className="block w-14 cursor-pointer"
            />
          </div>

          {alert && (
            <div>
              <p className="mb-3 text-xl font-bold text-white">{alert.title}</p>
              <p className="mt-4 text-sm font-light">{alert.description}</p>
              {alert.onButtonClick && (
                <button
                  className="mt-4 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black"
                  onClick={alert.onButtonClick}
                >
                  {alert.buttonText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </BotAlertContext.Provider>
  );
};

export const useBotAlert = () => {
  const { t } = useTranslation('athena');
  const context = useContext(BotAlertContext);
  if (!context) throw new Error('Bot alert context not found in tree');
  const { open, setAlert, setOpen, alert } = context;

  const showAlert = useCallback(
    (message: BotAlertMessage) => {
      message.title ||= t('athena-bot');

      if (alert?.title !== message.title) {
        setAlert(message);
        setOpen(true);
      }
    },
    [alert?.title, setAlert, setOpen, t],
  );

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (open) {
      id = setTimeout(() => {
        setOpen(false);
      }, 12 * 1000);
    }

    return () => clearTimeout(id);
  }, [open, setOpen]);

  return {
    alert: showAlert,
    close: () => setOpen(false),
  };
};

const BotAlertContext = createContext<BotAlertContextInterface | null>(null);

interface BotAlertMessage {
  title?: string;
  description: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
}

interface BotAlertContextInterface {
  open: boolean;
  alert?: BotAlertMessage;
  setAlert: (message: BotAlertMessage) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
