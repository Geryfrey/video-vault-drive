
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { VideoGrid } from '@/components/videos/VideoGrid';
import { getAllVideos } from '@/lib/videoService';
import { useAuth } from '@/context/AuthContext';
import { Video } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const VideosPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const fetchedVideos = await getAllVideos(user);
        setVideos(fetchedVideos);
      } catch (error) {
        toast.error('Failed to load videos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [user]);
  
  return (
    <AppShell requireAuth>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Videos</h1>
          <Link to="/upload">
            <Button>Upload New Video</Button>
          </Link>
        </div>
        
        <VideoGrid videos={videos} isLoading={loading} />
        
        {!loading && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              You haven't uploaded any videos yet
            </p>
            <Link to="/upload">
              <Button>Upload Your First Video</Button>
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default VideosPage;
