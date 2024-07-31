/* eslint-disable import/max-dependencies */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { type TraderProfile, useTraderProfileQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import { Markdown } from 'shared/Markdown';
import { Expandable } from 'shared/Expandable';
import CoinsIcons from 'shared/CoinsIcons';
import { ButtonSelect } from 'shared/ButtonSelect';
import { ProfileHeader } from '../../account/PageProfile/ProfileHeader';
import ProfileLinks from './ProfileLinks';
import ProfileSection from './ProfileSection';
import {
  InfoIcon,
  OverviewIcon,
  SignalersIcon,
  TopFinancialProductsIcon,
} from './assets';
import PerformanceContent from './Performance';
import UserSignalers from './UserSignalers';
import UserProducts from './UserProducts';

export default function PageUserProfile() {
  const { t } = useTranslation();
  const { id: userId } = useParams<{ id: string }>();
  const profile = useTraderProfileQuery(userId || '');

  const [selectedPerformanceFilter, setSelectedPerformanceFilter] =
    useState<keyof TraderProfile['performance']>('month');

  return (
    <PageWrapper
      loading={profile.isLoading}
      className="flex flex-col gap-8 mobile:gap-5"
    >
      <ProfileHeader profile={profile.data} userId={userId || ''} />
      <div className="flex items-center justify-between gap-8 mobile:flex-col-reverse mobile:gap-5">
        <ProfileLinks profile={profile.data} className="shrink-0" />
        <div>
          <CoinsIcons
            coins={profile.data?.active_pairs.map(pair => pair.base.name) || []}
            size={38}
          />
        </div>
      </div>
      <hr className="opacity-10" />
      <ProfileSection
        label={t('users:page-profile.performance')}
        titlebarContent={
          <ButtonSelect
            value={selectedPerformanceFilter}
            onChange={setSelectedPerformanceFilter}
            options={[
              {
                value: 'month',
                label: t(
                  'users:page-profile.performance-content.filters.month',
                ),
              },
              {
                value: 'month3',
                label: t(
                  'users:page-profile.performance-content.filters.month3',
                ),
              },
            ]}
          />
        }
      >
        <PerformanceContent
          data={profile.data?.performance[selectedPerformanceFilter]}
        />
      </ProfileSection>
      <hr className="opacity-10" />
      <ProfileSection
        label={t('users:page-profile.overview')}
        icon={OverviewIcon}
      >
        {profile.data?.overview ? (
          <Expandable className="max-h-44">
            <Markdown
              value={profile.data?.overview}
              className="!text-[13px] !text-white/70"
            />
          </Expandable>
        ) : (
          <p className="rounded-lg bg-black/10 p-4 py-10 text-center text-sm font-light text-white/70">
            {t('common:nothing-to-show')}
          </p>
        )}
      </ProfileSection>
      <ProfileSection
        label={t('users:page-profile.signalers')}
        icon={SignalersIcon}
      >
        <UserSignalers userId={userId} />
      </ProfileSection>
      <ProfileSection
        label={t('users:page-profile.top-financial-products')}
        icon={TopFinancialProductsIcon}
      >
        {userId && <UserProducts userId={userId} />}
      </ProfileSection>
      <div className="flex items-start justify-start gap-2">
        <InfoIcon className="shrink-0" />
        <p className="text-xxs font-light text-white/50">
          {t('users:page-profile.footer')}
        </p>
      </div>
    </PageWrapper>
  );
}
