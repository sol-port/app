'use client';

import { Suspense } from 'react';
import { OptimizedImage } from './ui/optimized-image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/context/app-state-context';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

// Import images
const SolPortImage = '/sol-port.svg';

function SidebarContent() {
  const pathname = usePathname();
  const { isConsultationCompleted } = useAppState();
  const { t } = useLanguage();

  // Define sidebar items based on consultation status
  const sidebarItems = [
    {
      name: t('sidebar.aiConsultation'),
      href: '/chat',
      disabled: isConsultationCompleted,
    },
    {
      name: t('sidebar.portfolio'),
      href: '/overview',
      disabled: !isConsultationCompleted,
    },
    {
      name: t('sidebar.goals'),
      href: '/goals',
      disabled: !isConsultationCompleted,
    },
    {
      name: t('sidebar.analysis'),
      href: '/analysis',
      disabled: !isConsultationCompleted,
    },
    {
      name: t('sidebar.automation'),
      href: '/automation',
      disabled: !isConsultationCompleted,
    },
    {
      name: t('sidebar.notifications'),
      href: '/calendar',
      disabled: !isConsultationCompleted,
    },
  ];

  return (
    <div className="w-56 h-full bg-solport-card border-r border-[#334155] border-0 flex flex-col">
      <div className="p-4">
        <Link
          href={isConsultationCompleted ? '/overview' : '/chat'}
          prefetch={false}
          className="flex items-center space-x-2"
        >
          <OptimizedImage
            src={SolPortImage}
            alt="SolPort Logo"
            width={100}
            height={24}
          />
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href + item.name}
            href={item.disabled ? '#' : item.href}
            prefetch={false}
            className={cn(
              'flex items-center px-3 py-3 rounded-md transition-colors',
              pathname === item.href
                ? 'bg-[#273344] text-white'
                : 'text-solport-textSecondary hover:bg-[#273344] hover:text-white',
              item.disabled &&
                'opacity-50 pointer-events-none cursor-not-allowed'
            )}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault();
              }
            }}
          >
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar() {
  return (
    <Suspense
      fallback={
        <div className="w-56 h-full bg-solport-card animate-pulse"></div>
      }
    >
      <SidebarContent />
    </Suspense>
  );
}
