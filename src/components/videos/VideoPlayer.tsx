
import { useState, useEffect } from 'react';
import { Video } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // For demo purposes, we'll use the thumbnail as a placeholder
  // In a real app, we'd stream the video from Google Drive
  const videoUrl = video.driveUrl || '';
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-black">
        {video.status === 'completed' ? (
          <div className="w-full h-full flex items-center justify-center">
            {/* In a real implementation, we'd embed an actual video player here */}
            {isPlaying ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white">
                  Video playing... (This is a placeholder)
                </div>
              </div>
            ) : (
              <div 
                className="w-full h-full relative cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-primary border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-lg font-medium mb-2">
                Video is {video.status}
              </div>
              <div className="text-sm text-white/70">
                {video.status === 'processing' && "We're processing your video. This may take a few minutes."}
                {video.status === 'pending' && "Your video is in the queue. We'll start processing it soon."}
                {video.status === 'error' && "There was an error processing your video. Please try again."}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {video.status === 'completed' && video.driveUrl && (
        <div className="p-4 flex justify-end">
          <Button 
            onClick={() => window.open(video.driveUrl, '_blank')}
          >
            Download
          </Button>
        </div>
      )}
    </Card>
  );
}
