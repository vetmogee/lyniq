'use client';

import { useTranslations } from 'next-intl';
import Loading from '@/components/ui/Loading';

export default function LocalizedLoading() {
  const t = useTranslations('Common');
  return <Loading label={t('loading')} />;
}
