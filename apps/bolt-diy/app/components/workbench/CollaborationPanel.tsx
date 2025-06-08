import React, { useEffect, useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollaborationStore } from '~/lib/stores/collaboration';
import { Tooltip } from '~/components/ui/Tooltip';
import { Dialog, DialogTitle, DialogRoot } from '~/components/ui/Dialog';

const collaborationStore = new CollaborationStore();

interface CollaborationPanelProps {
  sessionId: string;
  className?: string;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ sessionId, className }) => {
  const isConnected = useStore(collaborationStore.isConnected);
  const connectionState = useStore(collaborationStore.connectionState);
  const collaborators = useStore(collaborationStore.collaborators);
  const [showDialog, setShowDialog] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(sessionId).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [sessionId]);

  useEffect(() => {
    collaborationStore.initializeSession(sessionId, {});
  }, [sessionId]);

  return (
    <>
      <div className={`flex items-center space-x-2 p-2 ${className}`}>
        {Object.values(collaborators).map((collaborator) => (
          <Tooltip key={collaborator.id} content={collaborator.name}>
            <img
              src={collaborator.avatar}
              alt={collaborator.name}
              className="w-8 h-8 rounded-full border-2"
              style={{ borderColor: collaborator.color }}
            />
          </Tooltip>
        ))}
        <button
          onClick={() => setShowDialog(true)}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <AnimatePresence>
        {showDialog && (
          <DialogRoot open={showDialog} onOpenChange={setShowDialog}>
            <Dialog>
              <DialogTitle>Share Session</DialogTitle>
              <p className="mt-2 text-sm text-gray-500">
                Share this session ID with others to collaborate in real-time.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={sessionId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </Dialog>
          </DialogRoot>
        )}
      </AnimatePresence>
    </>
  );
};
