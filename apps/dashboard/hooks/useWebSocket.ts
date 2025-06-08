'use client';

// TODO: confirm version & license.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* --- embedded utilities --- */
// No external utilities required for this file.
/* --- end embedded utilities --- */

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  enabled?: boolean;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onError,
    onOpen,
    onClose,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    enabled = true,
  } = options;

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const urlRef = useRef(url);

  // Update URL ref when it changes
  useEffect(() => {
    urlRef.current = url;
  }, [url]);

  const connect = useCallback(() => {
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) return;

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const ws = new window.WebSocket(urlRef.current);
      wsRef.current = ws;

      ws.onopen = () => {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          reconnectAttempts: 0,
          error: null,
        }));
        if (onOpen) onOpen();

        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast({
            type: 'success',
            title: 'Connected',
            message: 'Real-time connection established',
          });
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        setState((prev) => ({
          ...prev,
          error: 'WebSocket connection error',
          isConnecting: false,
        }));
        if (onError) onError(error);
      };

      ws.onclose = () => {
        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));
        if (onClose) onClose();

        // Auto-reconnect logic
        if (
          autoReconnect &&
          enabled &&
          state.reconnectAttempts < maxReconnectAttempts
        ) {
          setState((prev) => ({
            ...prev,
            reconnectAttempts: prev.reconnectAttempts + 1,
          }));

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);

          if (typeof window !== 'undefined' && (window as any).showToast) {
            (window as any).showToast({
              type: 'warning',
              title: 'Connection lost',
              message: `Attempting to reconnect... (${state.reconnectAttempts + 1}/${maxReconnectAttempts})`,
            });
          }
        } else if (state.reconnectAttempts >= maxReconnectAttempts) {
          setState((prev) => ({
            ...prev,
            error: 'Max reconnection attempts reached',
          }));

          if (typeof window !== 'undefined' && (window as any).showToast) {
            (window as any).showToast({
              type: 'error',
              title: 'Connection failed',
              message: 'Unable to establish real-time connection',
            });
          }
        }
      };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to create WebSocket connection',
        isConnecting: false,
      }));
    }
  }, [
    enabled,
    autoReconnect,
    maxReconnectAttempts,
    reconnectInterval,
    onMessage,
    onError,
    onOpen,
    onClose,
    state.reconnectAttempts,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      reconnectAttempts: 0,
    });
  }, []);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === window.WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(data));
        return true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    }
    return false;
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setState((prev) => ({ ...prev, reconnectAttempts: 0 }));
    connect();
  }, [disconnect, connect]);

  // Connect when enabled
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return disconnect;
  }, [enabled, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    sendMessage,
    reconnect,
    disconnect,
  };
}
