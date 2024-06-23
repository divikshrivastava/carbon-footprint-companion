import React, { useEffect, useState, useRef } from 'react';
import { Hume, HumeClient } from 'hume';
import {
  convertBlobToBase64,
  convertBase64ToBlob,
  ensureSingleValidAudioTrack,
  getAudioStream,
  getBrowserSupportedMimeType,
} from 'hume';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [socket, setSocket] = useState<any| null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioQueue = useRef<Blob[]>([]);
  const isPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    const connectToHume = async () => {
      const client = new HumeClient({
        apiKey: process.env.REACT_APP_HUME_API_KEY as string,
        secretKey: process.env.REACT_APP_HUME_SECRET_KEY as string,
      });

      const socket = await client.empathicVoice.chat.connect({
        configId: 'edfdb17b-0a67-4c9e-9029-0bd40f98ca40',
        onOpen: () => {
          console.log('WebSocket connection opened');
        },
        onMessage: (message: any) => {
          handleWebSocketMessageEvent(message);
        },
        onError: (error) => {
          console.error(error);
        },
        onClose: () => {
          console.log('WebSocket connection closed');
        }
      });

      setSocket(socket);
    };

    connectToHume();
  }, []);

  const handleSend = () => {
    if (socket && input.trim()) {
      socket.sendUserMessage({ text: input });
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput('');
    }
  };

  const handleAudioOutput = async (audioBase64: string) => {
    const mimeTypeResult = getBrowserSupportedMimeType();
    if (!mimeTypeResult.success) {
      console.error('Browser does not support required mime types');
      return;
    }
    const mimeType = mimeTypeResult.mimeType;
    const audioBlob = convertBase64ToBlob(audioBase64, mimeType);
    audioQueue.current.push(audioBlob);
    playNextAudio();
  };

  const playNextAudio = () => {
    if (isPlayingRef.current || audioQueue.current.length === 0) return;

    isPlayingRef.current = true;
    const audioBlob = audioQueue.current.shift();
    if (!audioBlob) return;

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => {
      isPlayingRef.current = false;
      playNextAudio();
    };
  };

  const startRecording = async () => {
    setIsRecording(true);
    const audioStream = await getAudioStream();
    ensureSingleValidAudioTrack(audioStream);
    const mimeTypeResult = getBrowserSupportedMimeType();
    if (!mimeTypeResult.success) {
      console.error('Browser does not support required mime types');
      return;
    }
    const mimeType = mimeTypeResult.mimeType;
    const recorder = new MediaRecorder(audioStream, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = async ({ data }) => {
      if (data.size > 0 && socket) {
        const audioBase64 = await convertBlobToBase64(data);
        socket.sendAudioInput({ data: audioBase64 });
      }
    };

    recorder.start(100);
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorderRef.current?.stop();
  };

  const handleWebSocketMessageEvent = (message: any) => {
    switch (message.type) {
      case 'user_message':
        setMessages((prev) => [...prev, `Bot: ${message.data.text}`]);
        break;
      case 'audio_output':
        handleAudioOutput(message.data);
        break;
      case 'assistant_message':
        setMessages((prev) => [...prev, `Bot: ${message.data.text}`]);
        break;
      case 'user_interruption':
        stopAudio();
        break;
    }
  };

  const stopAudio = () => {
    isPlayingRef.current = false;
    audioQueue.current.length = 0;
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioElement.pause();
    }
  };

  return (
    <div>
      <h1>Chat with Carbon Footprint Bot</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
      <div>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  );
};

export default Chat;
