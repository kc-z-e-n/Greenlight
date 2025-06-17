// src/VideoCall.tsx
import React, { useEffect, useRef } from 'react';
import DailyIframe 
from '@daily-co/daily-js';
import type { DailyCall } from '@daily-co/daily-js';

interface Props {
  roomUrl: string;
}

const VideoCall: React.FC<Props> = ({ roomUrl }) => {
  const callFrameRef = useRef<DailyCall | null>(null);

  useEffect(() => {
    const frame = DailyIframe.createFrame({
      showLeaveButton: true,
      iframeStyle: {
        width: '100%',
        height: '600px',
        border: '0',
      },
    });

    frame.join({ url: roomUrl });
    callFrameRef.current = frame;

    const container = document.getElementById('video-container');
    const iframeEl = frame.iframe;
    if (container && iframeEl instanceof HTMLIFrameElement) {
      container.innerHTML = '';
      container.appendChild(iframeEl);
    }

    return () => {
      frame.leave();
    };
  }, [roomUrl]);

  return <div id="video-container" />;
};

export default VideoCall;
