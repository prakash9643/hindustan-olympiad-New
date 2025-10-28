'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Team = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/team/view-schools'); // change to your actual dashboard route
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center">
      <p>Redirecting to school dashboard...</p>
    </div>
  );
};

export default Team;