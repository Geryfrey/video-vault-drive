
import { useState, useEffect, useRef } from 'react';
import { Video } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlayIcon, 
  PauseIcon, 
  Volume2Icon, 
  VolumeXIcon 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Reset player state when video changes
    setIsPlaying(false);
    setCurrentTime(0);
  }, [video.id]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-black">
        {video.status === 'completed' ? (
          <div className="w-full h-full">
            {/* Actual video player for completed videos */}
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              poster={video.thumbnailUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onClick={handlePlayPause}
              muted={isMuted}
            >
              <source src={video.driveUrl} type={`video/${video.targetFormat}`} />
              {video.subtitlesUrl && (
                <track 
                  kind="subtitles" 
                  src={video.subtitlesUrl} 
                  label="English" 
                  default 
                />
              )}
              Your browser does not support the video tag.
            </video>
            
            {/* Video controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex flex-col space-y-2">
                {/* Progress bar */}
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-gray-600"
                  />
                </div>
                
                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handlePlayPause}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? 
                              <PauseIcon className="h-5 w-5" /> : 
                              <PlayIcon className="h-5 w-5" />
                            }
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isPlaying ? 'Pause' : 'Play'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleMuteToggle}
                            className="text-white hover:bg-white/20"
                          >
                            {isMuted ? 
                              <VolumeXIcon className="h-5 w-5" /> : 
                              <Volume2Icon className="h-5 w-5" />
                            }
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isMuted ? 'Unmute' : 'Mute'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <span className="text-xs text-white">
                      {formatTime(currentTime)} / {formatTime(duration || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
        <div className="p-4 flex justify-between items-center">
          <div>
            {video.subtitlesUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(video.subtitlesUrl, '_blank')}
              >
                Download Subtitles
              </Button>
            )}
          </div>
          <Button 
            onClick={() => window.open(video.driveUrl, '_blank')}
          >
            Download Video
          </Button>
        </div>
      )}
    </Card>
  );
}
