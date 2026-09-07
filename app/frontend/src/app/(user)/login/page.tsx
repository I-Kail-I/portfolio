import { Suspense } from 'react';
import { LoginSection } from './_sections/login-section';

export default function Page() {
  return (
    <div>
      <Suspense>
        <LoginSection />
      </Suspense>
    </div>
  );
}
