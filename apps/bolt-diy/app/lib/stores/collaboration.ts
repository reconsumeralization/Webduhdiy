import { atom, map } from "nanostores";
import { workbenchStore } from "./workbench";
import { logStore } from "./logs";

// Types for collaboration
export interface CollaboratorInfo {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: {
    file: string;
    line: number;
    column: number;
  };
  selection?: {
    file: string;
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  lastSeen: Date;
  isTyping: boolean;
  status: "online" | "away" | "offline";
}

export interface FileChange {
  id: string;
  file: string;
  operation: "insert" | "delete" | "replace";
  position: number;
  content: string;
  length?: number;
  timestamp: Date;
  author: string;
  version: number;
}

export interface ConflictResolution {
  fileId: string;
  conflictId: string;
  type: "merge" | "overwrite" | "reject";
  resolution: "local" | "remote" | "manual";
  resolvedBy: string;
  timestamp: Date;
}

// Enhanced WebSocket connection with operational transformation
class CollaborationWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageQueue: Array<any> = [];
  private isReconnecting = false;

  constructor(private onMessage: (data: any) => void) {}

  connect(sessionId: string, userId: string, userInfo: Partial<CollaboratorInfo>) {
    if (this.isReconnecting) return;

    try {
      const wsUrl = `${this.getWebSocketUrl()}/ws?type=collaboration&session=${sessionId}&user=${userId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        logStore.logSystem("🤝 Collaboration WebSocket connected");
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        this.startHeartbeat();

        // Send user info
        this.send("user-join", userInfo);
        this.flushMessageQueue();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          logStore.logError("Failed to parse WebSocket message", error);
        }
      };

      this.ws.onclose = (event) => {
        logStore.logSystem("🔌 Collaboration WebSocket disconnected", {
          code: event.code,
          reason: event.reason,
        });
        this.stopHeartbeat();

        if (!this.isReconnecting && event.code !== 1000) {
          this.attemptReconnect(sessionId, userId, userInfo);
        }
      };

      this.ws.onerror = (error) => {
        logStore.logError("❌ Collaboration WebSocket error", error);
      };
    } catch (error) {
      logStore.logError("Failed to connect collaboration WebSocket", error);
      this.attemptReconnect(sessionId, userId, userInfo);
    }
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host =
      process.env.NODE_ENV === "production" ? process.env.VITE_WS_URL || "wss://api.webduh.io" : "ws://localhost:3001";
    return `${protocol}//${host.replace(/^https?:\/\//, "")}`;
  }

  private attemptReconnect(sessionId: string, userId: string, userInfo: Partial<CollaboratorInfo>) {
    if (this.isReconnecting || this.reconnectAttempts >= this.maxReconnectAttempts) return;

    this.isReconnecting = true;
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    logStore.logSystem(`🔄 Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    setTimeout(() => {
      this.connect(sessionId, userId, userInfo);
    }, delay);
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send("ping", { timestamp: Date.now() });
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message.type, message.data);
    }
  }

  send(type: string, data: any) {
    const message = {
      type,
      data: {
        ...data,
        timestamp: Date.now(),
        clientId: this.generateClientId(),
      },
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(message);
      logStore.logSystem("Message queued - WebSocket not ready", { type, messageCount: this.messageQueue.length });
    }
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  disconnect() {
    this.isReconnecting = false;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, "User disconnected");
      this.ws = null;
    }
  }

  getConnectionState(): string {
    if (!this.ws) return "disconnected";
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "disconnected";
      default:
        return "unknown";
    }
  }
}

// Operational Transform implementation for conflict resolution
class OperationalTransform {
  static transform(operation1: FileChange, operation2: FileChange): [FileChange, FileChange] {
    // Simplified operational transform - real implementation would be more complex
    if (operation1.position <= operation2.position) {
      if (operation1.operation === "insert") {
        return [
          operation1,
          {
            ...operation2,
            position: operation2.position + (operation1.content?.length || 0),
          },
        ];
      }
    }

    return [operation1, operation2];
  }

  static apply(content: string, operation: FileChange): string {
    try {
      switch (operation.operation) {
        case "insert":
          return content.slice(0, operation.position) + operation.content + content.slice(operation.position);
        case "delete":
          return content.slice(0, operation.position) + content.slice(operation.position + (operation.length || 0));
        case "replace":
          return (
            content.slice(0, operation.position) +
            operation.content +
            content.slice(operation.position + (operation.length || 0))
          );
        default:
          return content;
      }
    } catch (error) {
      logStore.logError("Failed to apply operation", error);
      return content;
    }
  }
}

// Main collaboration store
export class CollaborationStore {
  // Core state
  isConnected = atom(false);
  connectionState = atom<string>("disconnected");
  sessionId = atom<string | null>(null);
  currentUser = atom<CollaboratorInfo | null>(null);
  collaborators = map<Record<string, CollaboratorInfo>>({});

  // File operations
  fileChanges = map<Record<string, FileChange[]>>({});
  conflicts = map<Record<string, ConflictResolution[]>>({});
  fileVersions = map<Record<string, number>>({});
  pendingOperations = map<Record<string, FileChange[]>>({});

  // UI state
  showCursors = atom(true);
  showPresence = atom(true);
  isTyping = atom(false);

  // Performance metrics
  operationLatency = atom<number[]>([]);
  conflictCount = atom(0);

  private ws: CollaborationWebSocket;
  private typingTimeout: NodeJS.Timeout | null = null;
  private presenceUpdateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.ws = new CollaborationWebSocket(this.handleWebSocketMessage.bind(this));
    this.startPresenceUpdates();
  }

  // Initialize collaboration session
  async initializeSession(sessionId: string, user: Partial<CollaboratorInfo>): Promise<CollaboratorInfo> {
    try {
      logStore.logSystem("Initializing collaboration session", { sessionId });

      this.sessionId.set(sessionId);

      const currentUser: CollaboratorInfo = {
        id: user.id || this.generateUserId(),
        name: user.name || "Anonymous",
        avatar: user.avatar,
        color: user.color || this.generateUserColor(),
        lastSeen: new Date(),
        isTyping: false,
        status: "online",
      };

      this.currentUser.set(currentUser);
      this.ws.connect(sessionId, currentUser.id, currentUser);

      // Update connection state
      this.connectionState.set(this.ws.getConnectionState());
      this.isConnected.set(this.ws.getConnectionState() === "connected");

      return currentUser;
    } catch (error) {
      logStore.logError("Failed to initialize collaboration session", error);
      throw error;
    }
  }

  // Handle incoming WebSocket messages
  private handleWebSocketMessage(message: any) {
    const { type, data } = message;
    const startTime = performance.now();

    try {
      switch (type) {
        case "user-joined":
          this.handleUserJoined(data);
          break;
        case "user-left":
          this.handleUserLeft(data);
          break;
        case "user-updated":
          this.handleUserUpdated(data);
          break;
        case "cursor-move":
          this.handleCursorMove(data);
          break;
        case "selection-change":
          this.handleSelectionChange(data);
          break;
        case "file-change":
          this.handleFileChange(data);
          break;
        case "typing-start":
          this.handleTypingStart(data);
          break;
        case "typing-stop":
          this.handleTypingStop(data);
          break;
        case "conflict-detected":
          this.handleConflictDetected(data);
          break;
        case "conflict-resolved":
          this.handleConflictResolved(data);
          break;
        case "pong":
          this.updateConnectionState();
          break;
        case "error":
          logStore.logError("Collaboration error received", data);
          break;
        default:
          logStore.logSystem("Unknown collaboration message type", { type, data });
      }

      // Track operation latency
      const latency = performance.now() - startTime;
      const latencies = this.operationLatency.get();
      this.operationLatency.set([...latencies.slice(-50), latency]); // Keep last 50 measurements
    } catch (error) {
      logStore.logError("Error handling collaboration message", error);
    }
  }

  // Event handlers
  private handleUserJoined(data: CollaboratorInfo) {
    this.collaborators.setKey(data.id, data);
    logStore.logSystem(`👋 ${data.name} joined the collaboration session`);
  }

  private handleUserLeft(data: { userId: string; userName?: string }) {
    const collaborators = this.collaborators.get();
    delete collaborators[data.userId];
    this.collaborators.set(collaborators);
    logStore.logSystem(`👋 ${data.userName || "User"} left the collaboration session`);
  }

  private handleUserUpdated(data: Partial<CollaboratorInfo> & { id: string }) {
    const collaborator = this.collaborators.get()[data.id];
    if (collaborator) {
      this.collaborators.setKey(data.id, { ...collaborator, ...data });
    }
  }

  private handleCursorMove(data: { userId: string; cursor: CollaboratorInfo["cursor"] }) {
    const collaborator = this.collaborators.get()[data.userId];
    if (collaborator && this.showCursors.get()) {
      this.collaborators.setKey(data.userId, { ...collaborator, cursor: data.cursor });
    }
  }

  private handleSelectionChange(data: { userId: string; selection: CollaboratorInfo["selection"] }) {
    const collaborator = this.collaborators.get()[data.userId];
    if (collaborator && this.showCursors.get()) {
      this.collaborators.setKey(data.userId, { ...collaborator, selection: data.selection });
    }
  }

  private handleFileChange(data: FileChange) {
    logStore.logSystem("Received file change", { file: data.file, operation: data.operation });
    this.applyFileChange(data);
  }

  private handleTypingStart(data: { userId: string; file: string }) {
    const collaborator = this.collaborators.get()[data.userId];
    if (collaborator) {
      this.collaborators.setKey(data.userId, { ...collaborator, isTyping: true });
    }
  }

  private handleTypingStop(data: { userId: string }) {
    const collaborator = this.collaborators.get()[data.userId];
    if (collaborator) {
      this.collaborators.setKey(data.userId, { ...collaborator, isTyping: false });
    }
  }

  private handleConflictDetected(data: any) {
    this.conflictCount.set(this.conflictCount.get() + 1);
    logStore.logSystem("🚨 Conflict detected", data);
  }

  private handleConflictResolved(data: ConflictResolution) {
    const conflicts = this.conflicts.get();
    if (!conflicts[data.fileId]) {
      conflicts[data.fileId] = [];
    }
    conflicts[data.fileId].push(data);
    this.conflicts.set(conflicts);
    logStore.logSystem("✅ Conflict resolved", data);
  }

  // Apply file changes with operational transformation
  private applyFileChange(change: FileChange) {
    try {
      const currentVersion = this.fileVersions.get()[change.file] || 0;

      if (change.version <= currentVersion) {
        // Handle out-of-order operations
        this.handleOutOfOrderOperation(change);
        return;
      }

      // Apply transformation to pending operations
      const pending = this.pendingOperations.get()[change.file] || [];
      const transformedOperations = pending.map((op) => {
        const [transformed] = OperationalTransform.transform(change, op);
        return transformed;
      });

      // Apply change to workbench if it's the current file
      const currentDocument = workbenchStore.currentDocument.get();
      if (currentDocument?.filePath === change.file) {
        const newContent = OperationalTransform.apply(currentDocument.value, change);
        workbenchStore.setCurrentDocumentContent(newContent);
      }

      // Update version and history
      this.fileVersions.setKey(change.file, change.version);

      const changes = this.fileChanges.get();
      if (!changes[change.file]) {
        changes[change.file] = [];
      }
      changes[change.file].push(change);
      this.fileChanges.set(changes);

      // Update pending operations
      this.pendingOperations.setKey(change.file, transformedOperations);
    } catch (error) {
      logStore.logError("Failed to apply file change", error);
    }
  }

  private handleOutOfOrderOperation(change: FileChange) {
    // Queue for reordering
    const pending = this.pendingOperations.get()[change.file] || [];
    pending.push(change);
    this.pendingOperations.setKey(change.file, pending);

    logStore.logSystem("Queued out-of-order operation", {
      file: change.file,
      version: change.version,
      queueLength: pending.length,
    });
  }

  // Public methods for collaboration actions
  broadcastCursorMove(file: string, line: number, column: number) {
    if (!this.showCursors.get()) return;

    const cursor = { file, line, column };
    this.ws.send("cursor-move", { cursor });

    // Update local state
    const user = this.currentUser.get();
    if (user) {
      this.currentUser.set({ ...user, cursor });
    }
  }

  broadcastSelectionChange(
    file: string,
    start: { line: number; column: number },
    end: { line: number; column: number },
  ) {
    if (!this.showCursors.get()) return;

    const selection = { file, start, end };
    this.ws.send("selection-change", { selection });

    // Update local state
    const user = this.currentUser.get();
    if (user) {
      this.currentUser.set({ ...user, selection });
    }
  }

  broadcastFileChange(
    file: string,
    operation: "insert" | "delete" | "replace",
    position: number,
    content: string,
    length?: number,
  ) {
    const currentVersion = this.fileVersions.get()[file] || 0;
    const newVersion = currentVersion + 1;

    const change: FileChange = {
      id: this.generateChangeId(),
      file,
      operation,
      position,
      content,
      length,
      timestamp: new Date(),
      author: this.currentUser.get()?.id || "unknown",
      version: newVersion,
    };

    this.ws.send("file-change", change);
    this.fileVersions.setKey(file, newVersion);

    logStore.logSystem("Broadcasting file change", {
      file,
      operation,
      position,
      contentLength: content.length,
    });
  }

  startTyping(file: string) {
    if (this.isTyping.get()) return;

    this.isTyping.set(true);
    this.ws.send("typing-start", { file });

    // Auto-stop typing after 3 seconds
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 3000);
  }

  stopTyping() {
    if (!this.isTyping.get()) return;

    this.isTyping.set(false);
    this.ws.send("typing-stop", {});

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  updatePresence(status: "online" | "away" | "offline" = "online") {
    const user = this.currentUser.get();
    if (user) {
      const updatedUser = { ...user, status, lastSeen: new Date() };
      this.currentUser.set(updatedUser);
      this.ws.send("user-update", updatedUser);
    }
  }

  private startPresenceUpdates() {
    this.presenceUpdateInterval = setInterval(() => {
      this.updatePresence();
      this.updateConnectionState();
    }, 60000); // Update every minute
  }

  private updateConnectionState() {
    const state = this.ws.getConnectionState();
    this.connectionState.set(state);
    this.isConnected.set(state === "connected");
  }

  // Utility methods
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateChangeId(): string {
    return `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateUserColor(): string {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#FFB6C1",
      "#87CEEB",
      "#DEB887",
      "#CD853F",
      "#DC143C",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Analytics and metrics
  getPerformanceMetrics() {
    const latencies = this.operationLatency.get();
    return {
      averageLatency: latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0,
      maxLatency: latencies.length > 0 ? Math.max(...latencies) : 0,
      conflictCount: this.conflictCount.get(),
      activeCollaborators: Object.keys(this.collaborators.get()).length,
      connectionState: this.connectionState.get(),
    };
  }

  // Cleanup
  disconnect() {
    logStore.logSystem("Disconnecting from collaboration session");

    if (this.presenceUpdateInterval) {
      clearInterval(this.presenceUpdateInterval);
      this.presenceUpdateInterval = null;
    }

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    this.ws.disconnect();
    this.isConnected.set(false);
    this.connectionState.set("disconnected");
    this.sessionId.set(null);
    this.currentUser.set(null);
    this.collaborators.set({});
    this.fileChanges.set({});
    this.conflicts.set({});
    this.pendingOperations.set({});
  }
}

// Export singleton instance
export const collaborationStore = new CollaborationStore();
