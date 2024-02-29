/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { Select, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { bxCheckCircle, bxChevronDown } from 'boxicons-quasar';
import { useAccountQuery, useCountriesQuery, useUserInfoMutation } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { REFERRER_CODE_KEY } from '../constants';
import ContainerAuth from '../ContainerAuth';
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

const PageSecondaryForm: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { data: account } = useAccountQuery();
  const { data: countries, isLoading: countriesLoading } = useCountriesQuery();
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState();
  const [referralCode, setReferralCode] = useState<string | undefined>('');
  const [contracts, setContracts] = useState({
    privacy: true,
    terms: true,
    risk: true,
  });

  useEffect(() => {
    if (!account) return;
    if (account?.register_status !== 'PRIMARY') {
      navigate('/');
    }
  }, [account, navigate]);

  useEffect(() => {
    const referrerCode = localStorage.getItem(REFERRER_CODE_KEY);
    if (referrerCode) {
      setReferralCode(referrerCode);
      localStorage.removeItem(REFERRER_CODE_KEY);
    }
  }, []);

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
      onClick: async () => {
        if (contracts[type]) {
          setContracts(x => ({ ...x, [type]: false }));
        } else if (await openModal()) {
          setContracts(x => ({ ...x, [type]: true }));
        }
      },
    };
  });

  const [errors, setErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const agreeToTerms = useUserInfoMutation();
  const anyErrorExists =
    !nickname ||
    !contracts.privacy ||
    !contracts.terms ||
    !contracts.risk ||
    !country ||
    nickname.length > 32;

  const onSubmit = async () => {
    setErrors(true);
    if (anyErrorExists) return;

    try {
      setIsSubmitting(true);
      await agreeToTerms({
        nickname,
        country,
        terms_and_conditions_accepted: true,
        privacy_policy_accepted: true,
        referrer_code: referralCode || undefined,
      });
      navigate('/');
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContainerAuth>
      <main className="mb-20 flex flex-col items-center justify-center">
        <div className="flex flex-col items-start mobile:px-4">
          <p
            className={clsx(
              'mb-8 w-full rounded-2xl bg-gray-600 p-4 capitalize text-green-400',
              'flex items-center justify-center gap-2',
            )}
          >
            <Icon name={bxCheckCircle} />
            {t('secondary.email-verified')}
          </p>

          <p className="mb-10 text-3xl md:text-4xl">
            <Trans i18nKey="secondary.welcome" ns="auth">
              Welcome to <b>Wisdomise</b>
            </Trans>
          </p>
          <InputBox
            error={
              errors &&
              ((!nickname && t('secondary.nickname.not-empty')) ||
                (nickname.length > 32 && t('secondary.nickname.length-limit')))
            }
            label={t('secondary.nickname.label')}
            placeholder={t('secondary.nickname.placeholder')}
            onChange={setNickname}
            value={nickname}
          />

          <div className="mb-5">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="pl-2 text-base">
              {t('secondary.country.placeholder')}
            </label>
            <Select
              showSearch
              optionFilterProp="label"
              value={country}
              onChange={setCountry}
              options={countries ?? []}
              loading={countriesLoading}
              placeholder={t('secondary.country.label')}
              size="large"
              className="mt-1 block w-[300px] rounded-xl border-2 border-solid border-[#ffffff1a] bg-transparent md:w-[400px]"
              suffixIcon={
                <Icon name={bxChevronDown} className="mr-2 text-white" />
              }
            />
            {errors && !country && (
              <p className="ml-2 text-error">
                {t('secondary.country.not-empty')}
              </p>
            )}
          </div>

          <InputBox
            error={
              errors &&
              referralCode == null &&
              t('secondary.invitation.not-found')
            }
            label={
              <Trans i18nKey="secondary.invitation.label" ns="auth">
                Invitation code
                <span className="text-xs text-[#FFFFFF80]">(Optional)</span>
              </Trans>
            }
            placeholder={t('secondary.invitation.placeholder')}
            onChange={setReferralCode}
            value={referralCode}
          />

          {contractsDefs.map(({ type, title, onClick }) => (
            <CheckBox
              id={type}
              key={type}
              error={
                errors &&
                !contracts[type] &&
                t('secondary.contract.required-error', { title })
              }
              checked={contracts[type]}
              onClick={onClick}
              label={
                <Trans i18nKey="secondary.contract.label" ns="auth">
                  You are acknowledging the
                  <span className="text-[#13DEF2]">{{ title }}</span>.
                </Trans>
              }
            />
          ))}

          <Button
            disabled={errors && anyErrorExists}
            className="mt-5 w-full"
            onClick={onSubmit}
          >
            {isSubmitting
              ? t('secondary.btn-submit.loading')
              : t('secondary.btn-submit.label')}
          </Button>
        </div>
      </main>

      {contractsDefs.map(({ type, Modal }) => (
        <React.Fragment key={type}>{Modal}</React.Fragment>
      ))}
    </ContainerAuth>
  );
};

export default PageSecondaryForm;
