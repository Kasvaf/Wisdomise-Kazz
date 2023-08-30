import { clsx } from 'clsx';
import type React from 'react';
import { useCallback, useState } from 'react';
import { useUserInfoQuery } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import useNow from 'utils/useNow';
import Button from 'shared/Button';
import TextBox from 'shared/TextBox';
import useModal from 'shared/useModal';

interface Props {
  onResolve?: (v: boolean) => void;
  onConfirm: (code: string) => Promise<unknown>;
  onResend: () => void;
}

const toDigits = (v: string) =>
  String(v || '')
    .replaceAll(/\D+/g, '')
    .substring(0, 6);

const RESEND_TIMEOUT = 60;

const InputModal: React.FC<Props> = ({ onResolve, onResend, onConfirm }) => {
  const user = useUserInfoQuery();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ttl, setTtl] = useState(Date.now() + RESEND_TIMEOUT * 1000);
  const now = useNow();

  const submitHandler = useCallback(async () => {
    try {
      setSubmitting(true);
      await onConfirm(code);
      onResolve?.(true);
    } catch (error) {
      setError(unwrapErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }, [code, onConfirm, onResolve]);

  const codeChangeHandler = useCallback((v: string) => {
    setCode(v);
    setError('');
  }, []);

  const resendHandler = useCallback(() => {
    setTtl(Date.now() + RESEND_TIMEOUT * 1000);
    onResend();
  }, [onResend]);

  const userEmail = user.data?.account.info.email;
  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">Security verification</h1>

      <TextBox
        type="tel"
        value={code}
        filter={toDigits}
        onChange={codeChangeHandler}
        error={error}
        hint={userEmail && `Enter the 6-digit sent to ${userEmail}`}
        className="mb-6"
        inputClassName={clsx('tracking-[1em]')}
      />

      <div className="flex justify-stretch">
        <Button
          className="basis-1/2"
          variant="secondary"
          onClick={resendHandler}
          disabled={submitting || ttl > now}
        >
          Resend{' '}
          {ttl > now
            ? `(${Math.min(
                Math.floor((ttl - now) / 1000) + 1,
                RESEND_TIMEOUT,
              )})`
            : ''}
        </Button>
        <div className="w-6" />
        <Button
          className="basis-1/2"
          variant="primary"
          onClick={submitHandler}
          loading={submitting}
          disabled={Boolean(!code || error)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default function useSecurityInput({
  onConfirm,
  onResend,
}: {
  onConfirm: (code: string) => Promise<unknown>;
  onResend: () => void;
}): [React.FC, () => Promise<unknown>] {
  const [Component, update] = useModal(InputModal);
  return [
    Component,
    useCallback(
      () => update({ onResend, onConfirm }),
      [update, onResend, onConfirm],
    ),
  ];
}
