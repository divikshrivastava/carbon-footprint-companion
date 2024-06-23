import React, { useEffect, useState, useRef } from "react";
import { Hume, HumeClient, MimeType, convertBase64ToBlob } from "hume";
import {
  convertBlobToBase64,
  ensureSingleValidAudioTrack,
  getAudioStream,
  getBrowserSupportedMimeType,
} from "hume";
import { env } from "process";
import './Chat.css';
import botImage from './assets/bot.png';

const client = new HumeClient({
  apiKey: "WLCo6BuawUWxKxQTF4MrJLwK8hczZiEiuYEOfohFsOOoZoS3",
  secretKey: "hlfYbERRubR56lPNShRc47LBCRASePZoG53AI1ZEzsDBudbgSZqdQfrd2vhYki7h",
});

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<any | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioQueue, setAudioQueue] = useState<Blob[]>([]);

  useEffect(() => {
    connectToHume();
  }, []);

  // the recorder responsible for recording the audio stream to be prepared as the audio input
  // the stream of audio captured from the user's microphone
  // mime type supported by the browser the application is running in
  const mimeType: MimeType = (() => {
    const result = getBrowserSupportedMimeType();
    return result.success ? result.mimeType : MimeType.WEBM;
  })();

  // audio playback queue
  // the current audio element to be played
  // mime type supported by the browser the application is running in
  // play the audio within the playback queue, converting each Blob into playable HTMLAudioElements
  const connectToHume = async () => {
    const socket = await client.empathicVoice.chat.connect({
      configId: "338093fa-aeb5-44cd-9c32-a24b3ff21e02",
      onOpen: () => {
        setIsOpen(true);
        console.log("WebSocket connection opened");
      },
      onMessage: (message: any) => {
        console.log(message);
        handleWebSocketMessageEvent(message);
      },
      onError: (error) => {
        console.error(error);
      },
      onClose: () => {
        setIsOpen(false);
        console.log("WebSocket connection closed");
      },
    });

    setSocket(socket);
  };

  function handleWebSocketMessageEvent(
    message: Hume.empathicVoice.SubscribeEvent
  ): void {
    // place logic here which you would like to invoke when receiving a message through the socket
    switch (message.type) {
      // add received audio to the playback queue, and play next audio output
      case "audio_output":
        const queue = audioQueue;
        // convert base64 encoded audio to a Blob
        const audioOutput = message.data;
        const blob = convertBase64ToBlob(audioOutput, mimeType);
        // add audio Blob to audioQueue
        queue.push(blob);
        // play the next audio output
        setAudioQueue(queue);
        if (queue.length >= 1) playAudio();
        break;
      case "assistant_message":
        const list = messages;
        // convert base64 encoded audio to a Blob
        const msg = message?.message?.content || "";
        // add audio Blob to audioQueue
        list.push(msg);
        // play the next audio output
        setMessages(list);
        break;
      case "tool_call":
        if(message.name === 'addTasks'){
          console.log("Message", message)
        }

        break;
    }
  }

  const startRecording = async () => {
    setIsRecording(true);
    const audioStream = await getAudioStream();
    ensureSingleValidAudioTrack(audioStream);
    recorder.current = new MediaRecorder(audioStream, { mimeType });
    // callback for when recorded chunk is available to be processed
    recorder.current.ondataavailable = async ({ data }) => {
      // IF size of data is smaller than 1 byte then do nothing
      if (data.size < 1) return;
      // base64 encode audio data
      const encodedAudioData = await convertBlobToBase64(data);
      // define the audio_input message JSON
      const audioInput: Omit<Hume.empathicVoice.AudioInput, "type"> = {
        data: encodedAudioData,
      };
      // send audio_input message
      socket?.sendAudioInput(audioInput);
    };
    // capture audio input at a rate of 100ms (recommended)
    const timeSlice = 100;
    recorder.current.start(timeSlice);
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorder.current?.stop();
  };

  const playAudio = () => {
    if (audioQueue.length == 0 || isPlaying) return;
    // update isPlaying state
    setIsPlaying(true);
    // pull next audio output from the queue
    const queue = audioQueue;
    const audioBlob = queue.shift();
    setAudioQueue(queue);
    // IF audioBlob is unexpectedly undefined then do nothing
    if (!audioBlob) return;
    // converts Blob to AudioElement for playback
    const audioUrl = URL.createObjectURL(audioBlob);
    currentAudio.current = new Audio(audioUrl);
    // play audio
    currentAudio.current.play();
    // callback for when audio finishes playing
    currentAudio.current.onended = () => {
      // update isPlaying state
      setIsPlaying(false);
      // attempt to pull next audio output from queue
      if (audioQueue.length > 0) playAudio();
    };
  };

  return (

    <div className="chat-container">
      <img src={botImage} alt="Bot" className="bot-image" />
      <h1>Chat with Carbon Footprint Bot</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div className="recording-container">
        {isOpen && (
          <button onClick={isRecording ? stopRecording : startRecording} className="record-button">
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        )}
      </div>


{/* <input
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="Type your message here..."
  className="chat-input"  // Add this class
/>
<button onClick={handleSend} className="send-button">Send</button>  // Add this class */}
</div>
  );
};

export default Chat;
