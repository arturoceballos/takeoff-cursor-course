'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

type OnboardingStep = {
  name: string;
  company: string;
  role: string;
  useCase: string;
};

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: OnboardingStep) => void;
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingStep>({
    name: '',
    company: '',
    role: '',
    useCase: '',
  });

  const steps = [
    {
      title: 'Welcome! Let\'s get to know you',
      fields: [
        { key: 'name', label: 'What\'s your name?', type: 'text' },
        { key: 'company', label: 'Company name', type: 'text' },
      ],
    },
    {
      title: 'Your Role',
      fields: [
        { key: 'role', label: 'What\'s your role?', type: 'select', 
          options: ['Developer', 'Designer', 'Product Manager', 'Other'] },
      ],
    },
    {
      title: 'Final Step',
      fields: [
        { key: 'useCase', label: 'What will you use this for?', type: 'textarea' },
      ],
    },
  ];

  const handleInputChange = (key: keyof OnboardingStep, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === steps.length - 1) {
      onComplete(formData);
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Dialog.Title className="text-xl font-semibold mb-4">
                {steps[step].title}
              </Dialog.Title>

              <div className="space-y-4">
                {steps[step].fields.map(field => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        className="w-full rounded-md border border-gray-500 bg-white p-2 text-black"
                        value={formData[field.key as keyof OnboardingStep]}
                        onChange={e => handleInputChange(field.key as keyof OnboardingStep, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        className="w-full rounded-md border border-gray-500 bg-white p-2 text-black"
                        value={formData[field.key as keyof OnboardingStep]}
                        onChange={e => handleInputChange(field.key as keyof OnboardingStep, e.target.value)}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className="w-full rounded-md border border-gray-500 bg-white p-2 text-black"
                        value={formData[field.key as keyof OnboardingStep]}
                        onChange={e => handleInputChange(field.key as keyof OnboardingStep, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                {step > 0 && (
                  <button
                    onClick={() => setStep(prev => prev - 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {step === steps.length - 1 ? 'Complete' : 'Next'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex justify-center gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-4 rounded-full ${
                  i === step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 