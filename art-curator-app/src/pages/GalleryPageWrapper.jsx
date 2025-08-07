import { useSession } from '@supabase/auth-helpers-react';
import GalleryPage from './GalleryPage';

const GalleryPageWrapper = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  if (!userEmail) return <p>Please sign in to view your gallery.</p>;

  return <GalleryPage userEmail={userEmail} />;
};

export default GalleryPageWrapper;
