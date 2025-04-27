
import { AppShell } from '@/components/layout/AppShell';
import { VideoUploader } from '@/components/videos/VideoUploader';

const UploadPage = () => {
  return (
    <AppShell requireAuth>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
        <VideoUploader />
      </div>
    </AppShell>
  );
};

export default UploadPage;
