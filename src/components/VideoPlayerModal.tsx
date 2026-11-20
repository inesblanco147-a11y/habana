import { useEffect, useRef, useState } from "react";
import { X, Maximize2, Minimize2, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video } from "@/types/video";

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
}

const VideoPlayerModal = ({ video, onClose }: VideoPlayerModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play cuando abre el modal
  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [video]);

  // Pausa cuando cierra
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const pct = Number(e.target.value);
    videoRef.current.currentTime = (pct / 100) * videoRef.current.duration;
    setProgress(pct);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentTime = videoRef.current
    ? (progress / 100) * duration
    : 0;

  return (
    <Dialog open={!!video} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 bg-black border-none overflow-hidden">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col lg:flex-row w-full">
          {/* Reproductor */}
          <div ref={containerRef} className="relative bg-black flex-1 min-h-0">
            <div className="relative aspect-video w-full">
              <video
                ref={videoRef}
                src={video?.videoUrl}
                poster={video?.thumbnail || undefined}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                playsInline
              />

              {/* Overlay play/pause al hacer clic */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={togglePlay}
                >
                  <div className="bg-black/50 rounded-full p-4">
                    <Play className="h-10 w-10 text-white fill-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Controles */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-8">
              {/* Barra de progreso */}
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 accent-hasace-red cursor-pointer mb-2"
              />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={togglePlay} className="text-white hover:text-hasace-red transition-colors">
                    {isPlaying
                      ? <Pause className="h-5 w-5" />
                      : <Play className="h-5 w-5 fill-white" />
                    }
                  </button>
                  <button onClick={toggleMute} className="text-white hover:text-hasace-red transition-colors">
                    {isMuted
                      ? <VolumeX className="h-4 w-4" />
                      : <Volume2 className="h-4 w-4" />
                    }
                  </button>
                  <span className="text-white text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button onClick={toggleFullscreen} className="text-white hover:text-hasace-red transition-colors">
                  {isFullscreen
                    ? <Minimize2 className="h-4 w-4" />
                    : <Maximize2 className="h-4 w-4" />
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Panel de información */}
          <div className="lg:w-72 bg-background p-5 flex flex-col gap-3 max-h-[60vh] lg:max-h-none overflow-y-auto">
            {video?.thumbnail && (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover rounded-md hidden lg:block"
              />
            )}
            <h3 className="text-lg font-bold text-foreground leading-tight">
              {video?.title}
            </h3>
            {video?.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {video.description}
              </p>
            )}
            <Button
              className="mt-auto w-full bg-hasace-red hover:bg-hasace-red/90 text-white"
              onClick={onClose}
            >
              Cerrar video
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
