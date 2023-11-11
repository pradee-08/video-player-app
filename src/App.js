import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import WaveSurfer from "wavesurfer.js";

import "./App.css";

const App = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [hasAudio, setHasAudio] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const waveSurferRef = useRef(null);

  const handleVideoInputChange = (e) => {
    const file = e.target.files[0];
    setVideoUrl(URL.createObjectURL(file));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (videoUrl) {
      const videoElement = videoRef.current;
      const waveSurferElement = waveSurferRef.current;

      // Get video duration
      setVideoDuration(videoElement.duration);

      // Check if video has audio
      // Check if video has audio
      const hasAudio =
        videoElement.audioTracks && videoElement.audioTracks.length > 0;

      // Update state
      setHasAudio(hasAudio);

      // Initialize WaveSurfer for audio waveform if audio is present
      if (hasAudio) {
        const wavesurfer = WaveSurfer.create({
          container: waveSurferElement,
          waveColor: "violet",
          progressColor: "purple",
          cursorWidth: 1,
          barWidth: 2,
        });

        wavesurfer.load(videoUrl);

        // Clean up on component unmount
        return () => {
          wavesurfer.destroy();
        };
      }
    }
  }, [videoUrl]);

  return (
    <div className="App">
      <input type="file" accept="video/*" onChange={handleVideoInputChange} />
      {videoUrl && (
        <div>
          <ReactPlayer
            url={videoUrl}
            playing={isPlaying}
            ref={videoRef}
            controls
          />
          <div>
            <p>
              {videoDuration
                ? `Duration: ${videoDuration.toFixed(2)} seconds`
                : "Loading..."}
            </p>
            {hasAudio ? (
              <div>
                <p>Audio Detected</p>
                <div ref={waveSurferRef}></div>
              </div>
            ) : (
              <p>No Audio Detected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
