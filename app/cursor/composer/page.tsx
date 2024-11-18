'use client';

import { useState, useEffect } from 'react';
import { OnboardingModal } from '@/components/onboarding-modal';

export default function CursorComposerPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.setItem('userOnboardingData', JSON.stringify(data));
    setShowOnboarding(false);
  };

  return (
    <div>
      <div>Composer</div>
      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
    </div>
  );
}
