"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Settings,
  Home,
  Clock
} from "lucide-react";

interface Slide {
  id: number;
  image: string;
  title?: string;
}

interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  totalSlides: number;
  createdAt: string;
  autoPlay: boolean;
  slideInterval: number;
}

export default function SlideshowPage() {
  const params = useParams();
  const screenCode = params.code as string;

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Mock presentation data - in a real app, this would fetch from an API
  const mockPresentation: Presentation = {
    id: "demo-presentation",
    title: "Q4 Sales Report",
    slides: [
      {
        id: 1,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmN2Y3Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2xpZGUgMTogVGl0bGUgUGFnZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RNCBTYWxlcyBSZXBvcnQgMjAyNDwvdGV4dD48L3N2Zz4=",
        title: "Title Page"
      },
      {
        id: 2,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8+PHRleHQgeD0iNTAlIiB5PSIyMCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0iIzEwNzNhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2FsZXMgT3ZlcnZpZXc8L3RleHQ+PHJlY3QgeD0iMTAwIiB5PSIxNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMTA3M2FhIi8+PHJlY3QgeD0iMjUwIiB5PSIyMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMzQ4NGQzIi8+PHJlY3QgeD0iNDAwIiB5PSIxMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMWU4OGU1Ii8+PHJlY3QgeD0iNTUwIiB5PSI4MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiMwZjcwZmYiLz48L3N2Zz4=",
        title: "Sales Overview"
      },
      {
        id: 3,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8+PHRleHQgeD0iNTAlIiB5PSIyMCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0iIzE5N2EzZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UXVhcnRlcmx5IFJlc3VsdHM8L3RleHQ+PGNpcmNsZSBjeD0iNDAwIiBjeT0iMzAwIiByPSIxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE5N2EzZSIgc3Ryb2tlLXdpZHRoPSIyMCIvPjxjaXJjbGUgY3g9IjQwMCIgY3k9IjMwMCIgcj0iMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkY2Y4ZTgiIHN0cm9rZS13aWR0aD0iMjAiIHN0cm9rZS1kYXNoYXJyYXk9IjE1Ny4wOCAzOTIuNyIvPjx0ZXh0IHg9IjQwMCIgeT0iMzEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiMxOTdhM2UiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjc1JTwvdGV4dD48L3N2Zz4=",
        title: "Quarterly Results"
      },
      {
        id: 4,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmOWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGhhbmsgeW91PC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlF1ZXN0aW9ucz88L3RleHQ+PC9zdmc+",
        title: "Thank You"
      }
    ],
    totalSlides: 4,
    createdAt: "2024-01-15T10:30:00Z",
    autoPlay: false,
    slideInterval: 5000
  };

  // Load presentation data
  useEffect(() => {
    const loadPresentation = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/presentation/${screenCode}`);

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Presentation not found. Please check your screen code.");
          return;
        }

        const data = await response.json();
        setPresentation(data.presentation);

      } catch (err) {
        setError("Failed to load presentation. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    if (screenCode) {
      loadPresentation();
    }
  }, [screenCode]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !presentation) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        if (prev >= presentation.totalSlides - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, presentation.slideInterval);

    return () => clearInterval(interval);
  }, [isPlaying, presentation]);

  // Countdown timer for auto-play
  useEffect(() => {
    if (!isPlaying || !presentation) return;

    setTimeRemaining(presentation.slideInterval);
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) return presentation.slideInterval;
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(countdownInterval);
  }, [isPlaying, currentSlide, presentation]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          nextSlide();
          break;
        case 'Escape':
          exitFullscreen();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'p':
        case 'P':
          togglePlayPause();
          break;
        case 'r':
        case 'R':
          restartPresentation();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, presentation]);

  const nextSlide = useCallback(() => {
    if (presentation && currentSlide < presentation.totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [presentation, currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const restartPresentation = () => {
    setCurrentSlide(0);
    setIsPlaying(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold mb-2">Loading Presentation...</h2>
          <p className="text-gray-400">Screen Code: {screenCode}</p>
        </div>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Home className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Presentation Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Entered Code:</p>
            <p className="text-xl font-mono text-white">{screenCode}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentSlideData = presentation.slides[currentSlide];
  const progressPercentage = ((currentSlide + 1) / presentation.totalSlides) * 100;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Main Slide Display */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-8">
          <img
            src={currentSlideData.image}
            alt={`Slide ${currentSlide + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="lg"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 h-16 w-16 rounded-full"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 h-16 w-16 rounded-full"
          onClick={nextSlide}
          disabled={currentSlide >= presentation.totalSlides - 1}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{presentation.title}</h1>
            <p className="text-gray-300">Screen Code: {screenCode}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-lg font-medium">
                {currentSlide + 1} / {presentation.totalSlides}
              </p>
              {currentSlideData.title && (
                <p className="text-sm text-gray-300">{currentSlideData.title}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress
              value={progressPercentage}
              className="h-2 bg-white/20"
            />
            <div className="flex justify-between text-sm text-gray-300">
              <span>Progress: {Math.round(progressPercentage)}%</span>
              {isPlaying && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Next slide in {Math.ceil(timeRemaining / 1000)}s</span>
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={restartPresentation}
              className="bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Restart
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={togglePlayPause}
              className="bg-white/10 hover:bg-white/20 text-white border-0"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Auto Play
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={toggleFullscreen}
              className="bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <Maximize className="w-5 h-5 mr-2" />
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </div>

          {/* Slide Thumbnails */}
          <div className="flex justify-center space-x-2 pt-4">
            {presentation.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`w-16 h-12 rounded border-2 transition-all ${
                  index === currentSlide
                    ? 'border-blue-500 opacity-100'
                    : 'border-white/30 opacity-60 hover:opacity-80'
                }`}
              >
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute top-4 right-4">
        <div className="bg-black/70 p-3 rounded-lg text-xs text-gray-300 hidden group-hover:block">
          <p><strong>Keyboard Shortcuts:</strong></p>
          <p>← → : Navigate slides</p>
          <p>Space: Next slide</p>
          <p>P: Play/Pause</p>
          <p>F: Fullscreen</p>
          <p>R: Restart</p>
          <p>Esc: Exit fullscreen</p>
        </div>
      </div>
    </div>
  );
}
