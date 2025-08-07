"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Monitor,
  BarChart3,
  Settings,
  FileText,
  Video,
  Image,
  Play,
  Share,
  Download,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  LogOut,
  Home,
  HelpCircle,
  Eye,
  Zap,
  Wifi,
  WifiOff,
  CheckCircle,
  Trash2,
  X,
  AlertCircle,
  Clock,
  File
} from "lucide-react";

// File upload types
interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  slides?: string[];
  screenCode?: string;
  error?: string;
  createdAt: Date;
}

interface APISlide {
  pageNumber: number;
  image: string;
  width: number;
  height: number;
}

interface APIResponse {
  success: boolean;
  presentation: {
    slides: APISlide[];
  };
  screenCode: string;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, plan: string, role: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make request with credentials to include cookies
        const response = await fetch('/api/auth/me', {
          credentials: 'include' // This ensures cookies are sent
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser({
            name: userData.name,
            email: userData.email,
            plan: userData.plan || 'Starter', // Default to Starter plan
            role: userData.role || 'user' // Default to user role
          });
        } else {
          // If not authenticated, redirect to home
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Fallback to redirect if there's an error
        window.location.href = '/';
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    // Redirect to home page
    window.location.href = '/';
  };

  const stats = {
    totalPresentations: 24,
    activeScreens: 3,
    totalViews: 1247,
    storageUsed: 68,
    storageLimit: 500
  };

  const recentPresentations = [
    {
      id: 1,
      name: "Q4 Sales Report",
      type: "pdf",
      size: "2.4 MB",
      lastUsed: "2 hours ago",
      views: 45,
      status: "active"
    },
    {
      id: 2,
      name: "Product Demo",
      type: "video",
      size: "15.2 MB",
      lastUsed: "1 day ago",
      views: 23,
      status: "inactive"
    },
    {
      id: 3,
      name: "Team Meeting Slides",
      type: "pptx",
      size: "5.8 MB",
      lastUsed: "3 days ago",
      views: 12,
      status: "inactive"
    },
    {
      id: 4,
      name: "Marketing Overview",
      type: "pdf",
      size: "1.9 MB",
      lastUsed: "1 week ago",
      views: 67,
      status: "inactive"
    }
  ];

  const connectedScreens = [
    {
      id: 1,
      name: "Conference Room A",
      code: "ABC123",
      status: "connected",
      presentation: "Q4 Sales Report",
      location: "Building 1, Floor 2"
    },
    {
      id: 2,
      name: "Training Room",
      code: "XYZ789",
      status: "connected",
      presentation: "Product Demo",
      location: "Building 2, Floor 1"
    },
    {
      id: 3,
      name: "Lobby Display",
      code: "DEF456",
      status: "idle",
      presentation: null,
      location: "Main Entrance"
    }
  ];

  const sidebarItems = [
    { icon: Home, label: "Overview", id: "overview" },
    { icon: FileText, label: "Presentations", id: "presentations" },
    { icon: Monitor, label: "Screens", id: "screens" },
    { icon: BarChart3, label: "Analytics", id: "analytics" },
    { icon: Upload, label: "Upload", id: "upload" },
    { icon: Settings, label: "Settings", id: "settings" },
    ...(user?.role === 'admin' ? [{ icon: Settings, label: "Admin Panel", id: "admin" }] : [])
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'pptx': return FileText;
      default: return Image;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview': return 'Dashboard Overview';
      case 'presentations': return 'My Presentations';
      case 'screens': return 'Connected Screens';
      case 'analytics': return 'Analytics & Reports';
      case 'upload': return 'Upload New Content';
      case 'settings': return 'Account Settings';
      default: return 'Dashboard';
    }
  };

  // File upload handlers
  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'video/mp4',
      'video/mov'
    ];
    return validTypes.includes(file.type);
  };

  const processFile = async (file: File): Promise<{slides: string[], screenCode?: string}> => {
    // Use the actual API for file processing
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      // Check if we got a valid response
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();

          // Handle storage-specific errors with better messaging
          if (errorData.storageInfo) {
            errorMessage = `${errorData.details}\n\nStorage Info:\n` +
              `Used: ${errorData.storageInfo.storageUsed}/${errorData.storageInfo.storageLimit}\n` +
              `Available: ${errorData.storageInfo.availableStorage}\n` +
              `Plan: ${errorData.storageInfo.plan}\n\n` +
              `${errorData.suggestion || ''}`;
          } else if (response.status === 413) {
            errorMessage = errorData.details || 'File too large for hosting platform. Try compressing your PDF or splitting it into smaller files.';
          } else {
            errorMessage = errorData.details || errorData.error || errorMessage;
          }
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Parse the response with better error handling
      let result: APIResponse;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }

      // Validate the response structure
      if (!result.success || !result.presentation || !result.screenCode) {
        throw new Error('Invalid response format from server');
      }

      const slides = result.presentation.slides.map((slide: APISlide) => slide.image);

      if (slides.length === 0) {
        throw new Error('No slides were generated from the file');
      }

      return {
        slides,
        screenCode: result.screenCode
      };
    } catch (error) {
      console.error('File processing error:', error);

      // Provide user-friendly error messages
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while processing the file');
      }
    }
  };

  const uploadFile = async (file: File) => {
    if (!isValidFileType(file)) {
      alert('Unsupported file type. Please upload PDF, PowerPoint, images, or videos.');
      return;
    }

    // Remove arbitrary file size check - let the server handle storage limits
    const fileSizeMB = file.size / (1024 * 1024);
    const availableStorageMB = stats.storageLimit - stats.storageUsed;

    if (fileSizeMB > availableStorageMB) {
      alert(`File size (${fileSizeMB.toFixed(1)}MB) exceeds your available storage (${availableStorageMB.toFixed(1)}MB). Please free up space or upgrade your plan.`);
      return;
    }

    const fileId = generateFileId();
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading',
      progress: 0,
      createdAt: new Date()
    };

    setUploadedFiles(prev => [...prev, newFile]);

    try {
      // Simulate upload progress for UI feedback
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileId ? { ...f, progress } : f)
        );
      }

      // Change status to processing
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f)
      );

      // Process the file using the API
      const result = await processFile(file);

      // Simulate processing progress for UI feedback
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileId ? { ...f, progress } : f)
        );
      }

      // Mark as completed with slides and screen code
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileId ? {
          ...f,
          status: 'completed',
          progress: 100,
          slides: result.slides,
          screenCode: result.screenCode
        } : f)
      );

    } catch (error) {
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileId ? {
          ...f,
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to process file'
        } : f)
      );
    }
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(uploadFile);
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const generateSlideshow = (file: UploadedFile) => {
    if (!file.slides || file.slides.length === 0 || !file.screenCode) return;

    // Open slideshow in new window/tab
    const slideshowUrl = `/slideshow/${file.screenCode}`;
    window.open(slideshowUrl, '_blank');

    // Also show the screen code for manual entry on TVs
    alert(`Slideshow opened! Screen code for manual entry: ${file.screenCode}\n\nUse this code on any smart TV browser at:\nzcreens.com`);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Presentations</CardTitle>
                    <FileText className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalPresentations}</div>
                  <p className="text-xs text-green-600 mt-1">+2 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Screens</CardTitle>
                    <Monitor className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.activeScreens}</div>
                  <p className="text-xs text-blue-600 mt-1">3 of 10 limit</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-green-600 mt-1">+15% this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Storage</CardTitle>
                    <Upload className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.storageUsed} MB</div>
                  <Progress value={(stats.storageUsed / stats.storageLimit) * 100} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">of {stats.storageLimit} MB</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Presentations */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Presentations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPresentations.slice(0, 3).map((presentation) => {
                        const FileIcon = getFileIcon(presentation.type);
                        return (
                          <div key={presentation.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-9 bg-gray-200 rounded-lg flex items-center justify-center">
                              <FileIcon className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{presentation.name}</h4>
                              <p className="text-xs text-gray-500">{presentation.lastUsed} • {presentation.views} views</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => setActiveSection('presentations')}>
                      View All Presentations
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Connected Screens */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-sm">
                      <Monitor className="w-4 h-4" />
                      <span>Connected Screens</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {connectedScreens.slice(0, 2).map((screen) => (
                        <div key={screen.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 text-sm">{screen.name}</h4>
                            <Badge className={screen.status === 'connected' ? 'bg-green-500 text-xs' : 'text-xs'}>
                              {screen.code}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{screen.location}</p>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => setActiveSection('screens')}>
                      Manage Screens
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        );

      case 'presentations':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Presentations</CardTitle>
                <Button onClick={() => setActiveSection('upload')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload New
                </Button>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search presentations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPresentations.map((presentation) => {
                  const FileIcon = getFileIcon(presentation.type);
                  return (
                    <div key={presentation.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{presentation.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{presentation.size}</span>
                          <span>{presentation.lastUsed}</span>
                          <span>{presentation.views} views</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={presentation.status === 'active' ? 'default' : 'secondary'}
                          className={presentation.status === 'active' ? 'bg-green-500' : ''}
                        >
                          {presentation.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>Upload New Presentation</CardTitle>
                <CardDescription>
                  Upload your presentation files to display on any smart TV. PDF files will be converted to slideshows automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                    isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isDragOver ? 'Drop files here' : 'Drop files here or click to upload'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Support for PDF, PowerPoint, images, and videos
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                    <span>Available storage: {(stats.storageLimit - stats.storageUsed).toFixed(0)}MB</span>
                    <span>•</span>
                    <span>Formats: PDF, PPTX, MP4, PNG, JPG</span>
                  </div>
                  <Button className={isDragOver ? 'bg-blue-600' : ''}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.pptx,.ppt,.png,.jpg,.jpeg,.gif,.mp4,.mov"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Upload Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <File className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{file.name}</h4>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.status === 'completed' && (
                              <Button
                                size="sm"
                                onClick={() => generateSlideshow(file)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Generate Slideshow
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Status and Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className={`font-medium ${
                              file.status === 'completed' ? 'text-green-600' :
                              file.status === 'error' ? 'text-red-600' :
                              'text-blue-600'
                            }`}>
                              {file.status === 'uploading' ? 'Uploading...' :
                               file.status === 'processing' ? 'Processing PDF...' :
                               file.status === 'completed' ? 'Ready for slideshow' :
                               'Error'}
                            </span>
                            <span className="text-gray-500">{file.progress}%</span>
                          </div>

                          {(file.status === 'uploading' || file.status === 'processing') && (
                            <Progress value={file.progress} className="h-2" />
                          )}

                          {file.status === 'completed' && file.slides && (
                            <div className="mt-3">
                              <p className="text-sm text-green-600 mb-2">
                                ✓ Converted to {file.slides.length} slide{file.slides.length > 1 ? 's' : ''}
                              </p>
                            </div>
                          )}

                          {file.status === 'error' && file.error && (
                            <Alert className="mt-2 border-red-200 bg-red-50">
                              <AlertCircle className="w-4 h-4" />
                              <AlertDescription className="text-red-600 text-sm">
                                {file.error}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File Processing Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">PDF Processing</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      PDF files are automatically converted to JPEG images, with each page becoming a slide in your presentation.
                    </p>
                    <ul className="text-blue-600 text-sm space-y-1">
                      <li>• Each PDF page becomes a separate slide</li>
                      <li>• High-resolution image conversion</li>
                      <li>• Optimized for TV display</li>
                      <li>• Instant slideshow generation</li>
                      <li>• Limited only by your account storage</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Section Under Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">This section is currently being built. Please check back soon!</p>
              <Button variant="outline" className="mt-4" onClick={() => setActiveSection('overview')}>
                Back to Overview
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 flex flex-col h-screen ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Logo Section */}
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white font-bold text-xl w-8 h-8 rounded-lg flex items-center justify-center">
              Z
            </div>
            {sidebarOpen && <span className="font-semibold text-gray-900">creens</span>}
          </div>
        </div>

        {/* Navigation Section - Scrollable */}
        <nav className="mt-8 flex-1 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.id === 'admin') {
                  window.location.href = '/admin';
                } else {
                  setActiveSection(item.id);
                }
              }}
              className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors ${
                activeSection === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        {/* User Info Footer - Fixed at bottom */}
        <div className="p-4 flex-shrink-0 border-t border-gray-200">
          <div className={`flex items-center space-x-3 p-3 bg-gray-100 rounded-lg ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            {sidebarOpen && user && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.plan} Plan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">{getSectionTitle()}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
