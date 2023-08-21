import type React from 'react';
import { useCallback, useState } from 'react';
import { useAgreeToTermsMutation } from 'api';
import AuthPageContainer from '../AuthPageContainer';
import useModalContract from './useModalContract';
import CheckBox from './CheckBox';
import InputBox from './InputBox';

import * as privacyMd from './privacy.md';
import * as termsMd from './terms.md';
import * as riskMd from './risk.md';

const staticContracts: Array<{
  type: 'privacy' | 'terms' | 'risk';
  title: string;
  ContractDoc: React.FC;
}> = [
  {
    type: 'privacy',
    title: privacyMd.attributes.title,
    ContractDoc: privacyMd.ReactComponent,
  },
  {
    type: 'terms',
    title: termsMd.attributes.title,
    ContractDoc: termsMd.ReactComponent,
  },
  {
    type: 'risk',
    title: riskMd.attributes.title,
    ContractDoc: riskMd.ReactComponent,
  },
];

export const SecondaryForm: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [referralCode, setReferralCode] = useState<string | undefined>('');
  const [contracts, setContracts] = useState({
    privacy: false,
    terms: false,
    risk: false,
  });

  const contractsDefs = staticContracts.map(({ type, title, ContractDoc }) => {
    // since the array is static, it's ok to use the hooks inside it.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [Modal, openModal] = useModalContract({
      title,
      ContractDoc,
    });
    return {
      type,
      title,
      Modal,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      onClick: useCallback(async () => {
        if (contracts[type]) {
          setContracts(x => ({ ...x, [type]: false }));
        } else if (await openModal()) {
          setContracts(x => ({ ...x, [type]: true }));
        }
      }, [type, openModal]),
    };
  });

  const [errors, setErrors] = useState(false);
  const agreeToTerms = useAgreeToTermsMutation();
  const onSubmit = useCallback(async () => {
    setErrors(true);
    if (!nickname || !contracts.privacy || !contracts.terms || !contracts.risk)
      return;

    try {
      await agreeToTerms.mutateAsync({
        nickname,
        terms_and_conditions_accepted: true,
        privacy_policy_accepted: true,
        cryptocurrency_risk_disclosure_accepted: true,
        referral_code: referralCode || undefined,
      });
      window.location.reload();
    } catch (e) {
      console.log(e);

      const errorKeys = Object.keys((e as any).data.data);
      if (errorKeys.includes('referral_code')) {
        setReferralCode(undefined);
      }
    }
  }, [nickname, contracts, referralCode, agreeToTerms]);

  return (
    <AuthPageContainer>
      <main className="mb-20 flex flex-col items-center justify-center">
        <div className="flex flex-col items-start mobile:px-4">
          <p className="mb-10 text-3xl md:text-4xl">
            Welcome to <br />
            <b>Wisdomise Wealth</b>
          </p>
          <InputBox
            error={errors && !nickname && "Nickname can't be empty"}
            label="Nickname"
            placeholder="Your nickname"
            onChange={setNickname}
          />
          <InputBox
            error={errors && referralCode == null && 'Referrer not found'}
            label={
              <span>
                Invitation code{' '}
                <span className="text-xs text-[#FFFFFF80]">(Optional)</span>
              </span>
            }
            placeholder="Invitation code"
            onChange={setReferralCode}
          />

          {contractsDefs.map(({ type, title, onClick }) => (
            <CheckBox
              id={type}
              key={type}
              error={
                errors &&
                !contracts[type] &&
                `You should accept the ${title} in order to continue.`
              }
              checked={contracts[type]}
              onClick={onClick}
              label={
                <span>
                  You are acknowledging the{' '}
                  <span className="text-[#13DEF2]">{title}</span>.
                </span>
              }
            />
          ))}

          <button
            onClick={onSubmit}
            className="mt-5 w-full rounded-full border border-solid border-[#ffffff4d] bg-white px-9 py-3 text-base text-black md:px-16 md:py-5 md:text-xl"
          >
            Submit{agreeToTerms.isLoading ? 'ing ...' : ''}
          </button>
        </div>
      </main>

      {contractsDefs.map(({ type, Modal }) => (
        <Modal key={type} />
      ))}
    </AuthPageContainer>
  );
};
