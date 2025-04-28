
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
    driveUrl: 'https://drive.google.com/uc?export=download&id=abc123',
    ownerId: '2',
    subtitlesUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnails: [
      'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?auto=format&fit=crop&w=500&h=280',
      'https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=500&h=280',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=280'
    ]
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

// Generate random thumbnails
function generateThumbnails(): string[] {
  // Generate 3-5 thumbnails
  const count = Math.floor(Math.random() * 3) + 3;
  const thumbnails = [];
  
  // Sample image URLs
  const sampleImages = [
    'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?auto=format&fit=crop&w=500&h=280',
    'https://images.unsplash.com/photo-1497015289639-54688650d173?auto=format&fit=crop&w=500&h=280',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=280',
    'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=500&h=280',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=500&h=280'
  ];
  
  for (let i = 0; i < count; i++) {
    thumbnails.push(sampleImages[Math.floor(Math.random() * sampleImages.length)]);
  }
  
  return thumbnails;
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
  
  // Generate a random thumbnail
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
  
  // Add to mock videos array
  mockVideos.push(newVideo);
  
  // Simulate status changes for demo purposes
  simulateProcessing(newVideo);
  
  return newVideo;
}

// Simulate video processing status changes
function simulateProcessing(video: Video) {
  // Simulate starting processing after 3 seconds
  setTimeout(() => {
    video.status = 'processing';
    console.log(`Video ${video.id} is now processing`);
    
    // Simulate completion after another 5-10 seconds
    const completionTime = Math.floor(Math.random() * 5000) + 5000;
    setTimeout(() => {
      video.status = 'completed';
      video.completedAt = new Date().toISOString();
      video.driveUrl = `https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/04/file_example_MP4_640_3MG.mp4`;
      video.subtitlesUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      video.thumbnails = generateThumbnails();
      console.log(`Video ${video.id} is now completed`);
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
  
  // Remove from mockVideos
  mockVideos.splice(videoIndex, 1);
  
  return true;
}

// Generate subtitles for a video
export async function generateSubtitles(id: string, currentUser: User): Promise<string | null> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const video = mockVideos.find(v => v.id === id);
  
  if (!video) return null;
  
  // Check if user has permission
  if (currentUser.role !== 'admin' && video.ownerId !== currentUser.id) {
    throw new Error('Unauthorized');
  }
  
  // Check if video is completed
  if (video.status !== 'completed') {
    throw new Error('Video must be processed before generating subtitles');
  }
  
  // Mock subtitles URL
  const subtitlesUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  video.subtitlesUrl = subtitlesUrl;
  
  return subtitlesUrl;
}
