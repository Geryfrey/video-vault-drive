
import { VideoCard } from './VideoCard';
import { Video } from '@/types';
import { useNavigate } from 'react-router-dom';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
}

export function VideoGrid({ videos, isLoading = false }: VideoGridProps) {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-video bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onClick={() => navigate(`/videos/${video.id}`)}
        />
      ))}
    </div>
  );
}
