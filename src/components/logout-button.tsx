'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from './ui/button';

export default function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
          toast.success('Logout successful');
        },
        onError: () => {
          toast.error('Logout failed');
        },
      },
    });
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Sign Out
    </Button>
  );
}
