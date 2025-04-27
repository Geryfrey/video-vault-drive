
import { Video, ProcessingOptions, ProcessingStatus, User } from "@/types";

// Mock video data
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction Video',
    status: 'completed',
    originalFormat: 'mp4',
    targetFormat: 'mp4',
    targetResolution: '720p',
    createdAt: '2025-03-15T10:30:00Z',
    completedAt: '2025-03-15T11:00:00Z',
    size: 15728640, // 15MB
    duration: 180, // 3 minutes
    thumbnailUrl: 'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?auto=format&fit=crop&w=500&h=280',
    driveUrl: 'https://drive.google.com/file/d/abc123',
    ownerId: '2'
  },
  {
    id: '2',
    title: 'Project Demo',
    status: 'processing',
    originalFormat: 'mov',
    targetFormat: 'mp4',
    targetResolution: '1080p',
    createdAt: '2025-04-20T14:15:00Z',
    size: 104857600, // 100MB
    duration: 600, // 10 minutes
    thumbnailUrl: 'https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=500&h=280',
    ownerId: '2'
  },
  {
    id: '3',
    title: 'Company Presentation',
    status: 'pending',
    originalFormat: 'webm',
    targetFormat: 'mp4',
    targetResolution: '1080p',
    createdAt: '2025-04-25T09:45:00Z',
    size: 52428800, // 50MB
    duration: 900, // 15 minutes
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=280',
    ownerId: '1'
  }
];

// Get all videos (admins can see all, users only see their own)
export async function getAllVideos(currentUser: User): Promise<Video[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (currentUser.role === 'admin') {
    return [...mockVideos];
  } else {
    return mockVideos.filter(video => video.ownerId === currentUser.id);
  }
}

// Get a single video by ID
export async function getVideoById(id: string, currentUser: User): Promise<Video | null> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const video = mockVideos.find(v => v.id === id);
  
  if (!video) return null;
  
  // Check if user has access to this video
  if (currentUser.role !== 'admin' && video.ownerId !== currentUser.id) {
    return null;
  }
  
  return { ...video };
}

// Upload and process a new video
export async function uploadVideo(
  file: File,
  title: string,
  options: ProcessingOptions,
  currentUser: User
): Promise<Video> {
  // Simulate upload and processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a random thumbnail (in a real app, we'd extract this from the video)
  const randomSeed = Math.floor(Math.random() * 1000);
  const thumbnailUrl = `https://picsum.photos/seed/${randomSeed}/500/280`;
  
  const newVideo: Video = {
    id: `vid_${Date.now().toString()}`,
    title,
    status: 'pending',
    originalFormat: file.name.split('.').pop() as any || 'mp4',
    targetFormat: options.targetFormat,
    targetResolution: options.targetResolution,
    createdAt: new Date().toISOString(),
    size: file.size,
    duration: Math.floor(Math.random() * 600) + 60, // Random duration between 1-10 minutes
    thumbnailUrl,
    ownerId: currentUser.id
  };
  
  // In a real app, we'd send this to the backend for processing
  
  // Simulate status changes for demo purposes
  simulateProcessing(newVideo);
  
  return newVideo;
}

// Simulate video processing status changes
function simulateProcessing(video: Video) {
  // Simulate starting processing after 3 seconds
  setTimeout(() => {
    video.status = 'processing';
    
    // Simulate completion after another 5-10 seconds
    const completionTime = Math.floor(Math.random() * 5000) + 5000;
    setTimeout(() => {
      video.status = 'completed';
      video.completedAt = new Date().toISOString();
      video.driveUrl = `https://drive.google.com/file/d/sample${video.id}`;
    }, completionTime);
  }, 3000);
}

// Delete a video
export async function deleteVideo(id: string, currentUser: User): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const videoIndex = mockVideos.findIndex(v => v.id === id);
  
  if (videoIndex === -1) return false;
  
  const video = mockVideos[videoIndex];
  
  // Check if user has permission to delete
  if (currentUser.role !== 'admin' && video.ownerId !== currentUser.id) {
    throw new Error('Unauthorized');
  }
  
  // In a real app, we'd send a delete request to the API
  
  return true;
}

