'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const slides = [
    {
      title: "Discover Local Creators",
      desc: "Find YouTubers and vloggers in your area or wherever you travel.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Post or Find Gigs",
      desc: "Hire editors, drone operators, or actors for your next shoot.",
      image: "https://images.unsplash.com/photo-1585855900521-7d44a932e155?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Chat and Schedule",
      desc: "Seamlessly plan collaborations and meetups.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
           <div className="mb-8 rounded-2xl overflow-hidden shadow-xl h-64 w-full relative">
             <img
               src={slides[step].image}
               alt={slides[step].title}
               className="object-cover w-full h-full"
             />
           </div>
           <h1 className="text-3xl font-bold mb-4 text-slate-900">{slides[step].title}</h1>
           <p className="text-lg text-slate-600">{slides[step].desc}</p>
        </div>
      </div>

      <div className="p-6 pb-10">
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${i === step ? 'bg-[var(--color-primary)] w-6' : 'bg-slate-300'}`}
            />
          ))}
        </div>

        <Button className="w-full text-lg py-6" onClick={handleNext}>
          {step === slides.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
}
