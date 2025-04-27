
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎥</span>
            <h1 className="font-bold text-xl">Video Vault</h1>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 gradient-text">Cloud Video Processing Made Easy</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload, process, and store your videos securely with Google Drive integration. Resize, convert, and compress videos with just a few clicks.
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <Link to="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">Sign In</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Fast Processing</h3>
                <p className="text-muted-foreground">
                  Asynchronous processing with Celery & Redis for quick and efficient video conversion.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="text-3xl mb-4">🔄</div>
                <h3 className="text-xl font-bold mb-2">Format Conversion</h3>
                <p className="text-muted-foreground">
                  Convert videos between MP4, AVI, MKV, and more using FFmpeg technology.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow">
                <div className="text-3xl mb-4">☁️</div>
                <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
                <p className="text-muted-foreground">
                  Store processed videos securely in Google Drive with easy sharing options.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4 bg-background">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Video Vault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
