
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Video } from '@/types';
import { getVideoById } from '@/lib/videoService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { VideoPlayer } from '@/components/videos/VideoPlayer';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVideo = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        const fetchedVideo = await getVideoById(id, user);
        
        if (!fetchedVideo) {
          toast.error('Video not found');
          navigate('/videos');
          return;
        }
        
        setVideo(fetchedVideo);
      } catch (error) {
        toast.error('Failed to load video');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [id, user, navigate]);
  
  if (loading) {
    return (
      <AppShell requireAuth>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppShell>
    );
  }
  
  if (!video) {
    return (
      <AppShell requireAuth>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <Button onClick={() => navigate('/videos')}>Back to Videos</Button>
        </div>
      </AppShell>
    );
  }
  
  // Format size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };
  
  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };
  
  return (
    <AppShell requireAuth>
      <div className="space-y-6 max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/videos')}
          className="mb-2"
        >
          ← Back to Videos
        </Button>
        
        <h1 className="text-3xl font-bold">{video.title}</h1>
        
        <VideoPlayer video={video} />
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Original Format</span>
                <span className="font-medium">{video.originalFormat.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Format</span>
                <span className="font-medium">{video.targetFormat.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolution</span>
                <span className="font-medium">{video.targetResolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{formatDuration(video.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="font-medium">{formatFileSize(video.size)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Processing</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`processing-badge ${video.status}`}>
                  {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uploaded</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                </span>
              </div>
              {video.completedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(video.completedAt), { addSuffix: true })}
                  </span>
                </div>
              )}
              {video.status === 'completed' && video.driveUrl && (
                <div className="pt-4">
                  <Button 
                    onClick={() => window.open(video.driveUrl, '_blank')}
                    className="w-full"
                  >
                    Download from Google Drive
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default VideoDetailPage;
