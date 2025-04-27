
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
  video: Video;
  onClick?: () => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  // Format file size
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
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  // Status badge class
  const statusClass = {
    pending: "processing-badge pending",
    processing: "processing-badge processing",
    completed: "processing-badge completed",
    error: "processing-badge error"
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="aspect-video relative">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2">
          <span className={statusClass[video.status]}>
            {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{video.title}</h3>
        <div className="mt-1 space-y-1">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatFileSize(video.size)}</span>
            <span>{formatDuration(video.duration)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{video.targetFormat.toUpperCase()}</span>
            <span>{video.targetResolution}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
        </div>
        
        {video.status === 'completed' && (
          <Button 
            size="sm" 
            variant="ghost"
            className="text-xs px-2"
            onClick={(e) => {
              e.stopPropagation();
              window.open(video.driveUrl, '_blank');
            }}
          >
            Download
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
