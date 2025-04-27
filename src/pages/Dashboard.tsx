
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { VideoGrid } from '@/components/videos/VideoGrid';
import { getAllVideos } from '@/lib/videoService';
import { useAuth } from '@/context/AuthContext';
import { Video } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) return;
      
      try {
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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link to="/upload">
            <Button>Upload Video</Button>
          </Link>
        </div>
        
        <DashboardStats videos={videos} />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Videos</h2>
            <Link to="/videos">
              <Button variant="ghost">View all</Button>
            </Link>
          </div>
          
          <VideoGrid videos={videos.slice(0, 4)} isLoading={loading} />
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
