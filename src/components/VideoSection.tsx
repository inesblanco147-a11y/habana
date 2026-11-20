import { useState } from "react";
import { Play, Video as VideoIcon } from "lucide-react";
import { useVideos } from "@/hooks/useVideos";
import { Video } from "@/types/video";
import VideoPlayerModal from "@/components/VideoPlayerModal";

const VideoSection = () => {
  const { data: videos = [], isLoading } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold uppercase tracking-wide text-destructive mb-4">
            Videos
          </h2>
          <div className="w-24 h-1 bg-hasace-red mx-auto rounded-full mb-4" />
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Conoce más sobre nuestros tratamientos, instalaciones y resultados en nuestros videos.
          </p>
        </div>

        {/* Grid de videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group relative aspect-video rounded-xl overflow-hidden bg-muted shadow-md hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hasace-red focus:ring-offset-2"
              aria-label={`Reproducir: ${video.title}`}
            >
              {/* Thumbnail */}
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <VideoIcon className="h-12 w-12 text-primary/40" />
                </div>
              )}

              {/* Overlay oscuro al hover */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

              {/* Botón play centrado */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-hasace-red/90 group-hover:bg-hasace-red rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  <Play className="h-7 w-7 text-white fill-white" />
                </div>
              </div>

              {/* Título en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8">
                <p className="text-white font-semibold text-sm text-left line-clamp-2 leading-tight">
                  {video.title}
                </p>
                {video.description && (
                  <p className="text-white/70 text-xs text-left mt-0.5 line-clamp-1">
                    {video.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal reproductor */}
      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
};

export default VideoSection;
