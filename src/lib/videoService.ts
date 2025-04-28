
import { Video, ProcessingOptions, ProcessingStatus, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get all videos (admins can see all, users only see their own)
export async function getAllVideos(currentUser: User): Promise<Video[]> {
  try {
    let query = supabase
      .from('videos')
      .select('*');
    
    if (currentUser.role !== 'admin') {
      query = query.eq('user_id', currentUser.id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(transformDatabaseVideo);
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

// Get a single video by ID
export async function getVideoById(id: string, currentUser: User): Promise<Video | null> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    // Check if user has access to this video
    if (currentUser.role !== 'admin' && data.user_id !== currentUser.id) {
      return null;
    }
    
    return transformDatabaseVideo(data);
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
}

// Upload and process a new video
export async function uploadVideo(
  file: File,
  title: string,
  options: ProcessingOptions,
  currentUser: User
): Promise<Video> {
  try {
    // Create a unique filename using timestamp and original name
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser.id}/${timestamp}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${fileExt}`;
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl: driveUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);
    
    // Create video record in the database
    const { data: video, error: dbError } = await supabase
      .from('videos')
      .insert({
        title,
        original_filename: file.name,
        processed_filename: fileName,
        format: fileExt,
        resolution: options.targetResolution,
        size: file.size.toString(),
        status: 'completed',
        duration: '0', // Will be updated after processing
        user_id: currentUser.id,
        drive_link: driveUrl,
        processing_options: options,
        upload_date: new Date().toISOString()
      })
      .select()
      .single();
    
    if (dbError) throw dbError;
    
    // Generate thumbnail using the first frame
    await generateThumbnail(video.id, driveUrl);
    
    // Generate subtitles if requested
    if (options.generateSubtitles) {
      await generateSubtitles(video.id, currentUser);
    }
    
    return transformDatabaseVideo(video);
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

// Delete a video
export async function deleteVideo(id: string, currentUser: User): Promise<boolean> {
  try {
    const { data: video } = await supabase
      .from('videos')
      .select('processed_filename')
      .eq('id', id)
      .single();
    
    if (!video) return false;
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('videos')
      .remove([video.processed_filename]);
    
    if (storageError) throw storageError;
    
    // Delete the database record
    const { error: dbError } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);
    
    if (dbError) throw dbError;
    
    return true;
  } catch (error) {
    console.error('Delete video error:', error);
    throw error;
  }
}

// Generate subtitles for a video
export async function generateSubtitles(id: string, currentUser: User): Promise<string | null> {
  try {
    // For now, just update the subtitles URL in the database
    // In a real app, this would trigger a background job to generate subtitles
    const subtitlesUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    
    const { error } = await supabase
      .from('videos')
      .update({ subtitles_url: subtitlesUrl })
      .eq('id', id);
    
    if (error) throw error;
    
    return subtitlesUrl;
  } catch (error) {
    console.error('Generate subtitles error:', error);
    throw error;
  }
}

// Helper function to transform database video to our Video type
function transformDatabaseVideo(dbVideo: any): Video {
  return {
    id: dbVideo.id,
    title: dbVideo.title,
    status: dbVideo.status as ProcessingStatus,
    originalFormat: dbVideo.format as any,
    targetFormat: dbVideo.format as any,
    targetResolution: dbVideo.resolution as any,
    createdAt: dbVideo.created_at || dbVideo.upload_date,
    completedAt: dbVideo.processed_date,
    size: parseInt(dbVideo.size),
    duration: parseInt(dbVideo.duration),
    thumbnailUrl: dbVideo.thumbnail || 'https://picsum.photos/seed/1/500/280',
    driveUrl: dbVideo.drive_link,
    ownerId: dbVideo.user_id,
    subtitlesUrl: dbVideo.subtitles_url,
    thumbnails: dbVideo.thumbnails || []
  };
}

// Helper function to generate a thumbnail for a video
async function generateThumbnail(videoId: string, videoUrl: string): Promise<void> {
  try {
    // For now, just use a placeholder thumbnail
    // In a real app, this would generate actual thumbnails from the video
    const thumbnailUrl = `https://picsum.photos/seed/${videoId}/500/280`;
    
    const { error } = await supabase
      .from('videos')
      .update({
        thumbnail: thumbnailUrl,
        thumbnails: [thumbnailUrl]
      })
      .eq('id', videoId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Generate thumbnail error:', error);
    // Don't throw here as this is a background operation
    toast.error('Failed to generate thumbnail');
  }
}
