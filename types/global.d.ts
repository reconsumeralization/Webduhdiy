// Global type declarations for WebduhVercel

// Extend global Window interface
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
    _tabId?: string;
  }

  interface Performance {
    memory?: {
      jsHeapSizeLimit: number;
      totalJSHeapSize: number;
      usedJSHeapSize: number;
    };
  }
}

export {};
