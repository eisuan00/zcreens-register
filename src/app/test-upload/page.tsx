"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TestUploadPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    screenCode: string;
    presentation: { slides: { id: number; image: string }[] };
    slideshowUrl: string;
  } | null>(null);

  const testUpload = async () => {
    setIsProcessing(true);
    setResult(null);

    try {
      // First test the API health
      console.log('Testing API health...');
      const healthResponse = await fetch('/api/test');
      const healthData = await healthResponse.json();
      console.log('API Health:', healthData);

      // Create a more realistic mock PDF file for testing
      const mockPdfContent = new Blob(['%PDF-1.4 Mock PDF Content for Testing'], { type: 'application/pdf' });
      const mockFile = new File([mockPdfContent], 'test-presentation.pdf', { type: 'application/pdf' });

      console.log('Uploading file:', mockFile.name, mockFile.size, 'bytes');

      const formData = new FormData();
      formData.append('file', mockFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      console.log('Upload response status:', response.status, response.statusText);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        alert(`Server returned invalid response: ${responseText.substring(0, 200)}`);
        return;
      }

      if (response.ok) {
        console.log('Upload successful:', data);
        setResult(data);
      } else {
        console.error('Upload failed:', data);
        alert(`Upload failed: ${data.details || data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test PDF Upload & Slideshow System</CardTitle>
            <CardDescription>
              Test the upload API and slideshow viewer functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Button
                onClick={testUpload}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? 'Processing...' : 'Test Upload API'}
              </Button>
            </div>

            {result && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-600">Upload Successful!</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p><strong>Screen Code:</strong> {result.screenCode}</p>
                  <p><strong>Slides Generated:</strong> {result.presentation.slides.length}</p>
                  <p><strong>Slideshow URL:</strong> {result.slideshowUrl}</p>
                </div>
                <div className="flex space-x-4">
                  <Link href={result.slideshowUrl} target="_blank">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Open Slideshow
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(result.screenCode)}
                  >
                    Copy Screen Code
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demo Slideshows</CardTitle>
            <CardDescription>
              Pre-configured presentations for testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold">Q4 Sales Report</h4>
                <p className="text-sm text-gray-600 mb-3">Screen Code: ABC123</p>
                <Link href="/slideshow/ABC123" target="_blank">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    View Slideshow
                  </Button>
                </Link>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold">Product Demo</h4>
                <p className="text-sm text-gray-600 mb-3">Screen Code: DEMO</p>
                <Link href="/slideshow/DEMO" target="_blank">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    View Slideshow
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Upload API: /api/upload</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Presentation API: /api/presentation/[code]</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Test API: /api/test</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.open('/api/test', '_blank')}
            >
              Check API Health
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
