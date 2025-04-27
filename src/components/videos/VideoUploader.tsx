
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ProcessingOptions, VideoFormat, VideoResolution } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { uploadVideo } from '@/lib/videoService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function VideoUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    targetFormat: 'mp4',
    targetResolution: '720p',
    compress: true,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!title) {
        // Set title based on filename without extension
        const fileName = e.target.files[0].name;
        const titleFromName = fileName.split('.').slice(0, -1).join('.');
        setTitle(titleFromName);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      if (!title) {
        const fileName = e.dataTransfer.files[0].name;
        const titleFromName = fileName.split('.').slice(0, -1).join('.');
        setTitle(titleFromName);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file || !title || !user) return;
    
    try {
      setIsUploading(true);
      await uploadVideo(file, title, processingOptions, user);
      toast.success('Video uploaded successfully');
      navigate('/videos');
    } catch (error) {
      toast.error('Failed to upload video');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const formatOptions: VideoFormat[] = ['mp4', 'avi', 'mkv', 'webm', 'mov'];
  const resolutionOptions: VideoResolution[] = ['360p', '480p', '720p', '1080p', '4k'];
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
        
        <div className="space-y-8">
          {/* File Upload */}
          <div>
            <div
              className={`video-drop-area ${isDragging ? 'active' : ''} ${file ? 'border-primary bg-primary/5' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                  <Button 
                    variant="ghost" 
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-2xl mb-2">📁</div>
                  <div className="font-medium">Drag & drop your video file here</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    or click to browse
                  </div>
                </>
              )}
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter video title" 
            />
          </div>
          
          {/* Processing Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Processing Options</h3>
            
            {/* Target Format */}
            <div className="space-y-2">
              <Label htmlFor="format">Target Format</Label>
              <Select 
                value={processingOptions.targetFormat}
                onValueChange={(value) => 
                  setProcessingOptions(prev => ({ ...prev, targetFormat: value as VideoFormat }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Target Resolution */}
            <div className="space-y-2">
              <Label htmlFor="resolution">Target Resolution</Label>
              <Select 
                value={processingOptions.targetResolution}
                onValueChange={(value) => 
                  setProcessingOptions(prev => ({ ...prev, targetResolution: value as VideoResolution }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  {resolutionOptions.map((resolution) => (
                    <SelectItem key={resolution} value={resolution}>
                      {resolution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Compression */}
            <div className="flex items-center space-x-2">
              <Switch 
                id="compress" 
                checked={processingOptions.compress}
                onCheckedChange={(checked) => 
                  setProcessingOptions(prev => ({ ...prev, compress: checked }))
                }
              />
              <Label htmlFor="compress">Compress video</Label>
            </div>
          </div>
          
          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={!file || !title || isUploading} 
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
