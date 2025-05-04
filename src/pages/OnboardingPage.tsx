import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from '../lib/hooks/useOnboarding';
import { OnboardingLayout } from '../components/onboarding/OnboardingLayout';
import { StepOne } from '../components/onboarding/StepOne';
import { StepTwo } from '../components/onboarding/StepTwo';
import { StepThree } from '../components/onboarding/StepThree';
import { StepFour } from '../components/onboarding/StepFour';
import { StepFive } from '../components/onboarding/StepFive';
import { StepSix } from '../components/onboarding/StepSix';
import { Helmet } from 'react-helmet-async';

export function OnboardingPage() {
  return (
    <>
      <Helmet>
        <title>Restaurant Onboarding | Shiftless</title>
        <meta name="description" content="Complete your restaurant setup to start managing orders with Shiftless." />
      </Helmet>
    
      <OnboardingProvider>
        <Routes>
          <Route element={<OnboardingLayout />}>
            <Route path="/" element={<Navigate to="/onboarding/restaurant" replace />} />
            <Route path="/restaurant" element={<StepOne />} />
            <Route path="/hours" element={<StepTwo />} />
            <Route path="/bot" element={<StepThree />} />
            <Route path="/menu" element={<StepFour />} />
            <Route path="/preferences" element={<StepFive />} />
            <Route path="/payment" element={<StepSix />} />
          </Route>
        </Routes>
      </OnboardingProvider>
    </>
  );
}