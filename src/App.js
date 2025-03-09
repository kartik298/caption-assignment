import React, { useState, useRef, useEffect } from "react";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
  },
  header: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
    color: "#2c3e50",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sectionHeader: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#3498db",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: "#3498db",
    color: "white",
  },
  greenButton: {
    backgroundColor: "#2ecc71",
    color: "white",
  },
  redButton: {
    backgroundColor: "#e74c3c",
    color: "white",
  },
  grayButton: {
    backgroundColor: "#95a5a6",
    color: "white",
  },
  flexRow: {
    display: "flex",
    gap: "10px",
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoContainer: {
    position: "relative",
    aspectRatio: "16/9",
    backgroundColor: "black",
    borderRadius: "4px",
    overflow: "hidden",
  },
  captionsList: {
    border: "1px solid #ddd",
    borderRadius: "4px",
    maxHeight: "400px",
    overflowY: "auto",
  },
  captionItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  captionItemHighlighted: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#ebf5fb",
  },
  captionTimestamp: {
    color: "#3498db",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  captionText: {
    marginBottom: "10px",
  },
  captionOverlay: {
    position: "absolute",
    bottom: "40px",
    left: "0",
    right: "0",
    textAlign: "center",
    pointerEvents: "none",
  },
  captionContent: {
    display: "inline-block",
    backgroundColor: "rgba(0,0,0,0.75)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "18px",
    maxWidth: "90%",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#7f8c8d",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  timeDisplay: {
    fontSize: "14px",
    color: "#3498db",
    marginTop: "5px",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    color: "#7f8c8d",
    fontSize: "14px",
  },
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

const VideoCaptionEditor = () => {
  const isMediumScreen = useMediaQuery("(min-width: 768px)");

  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/watch?v=Vgz31QrIWOA"
  );
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoType, setVideoType] = useState("direct");
  const [embedUrl, setEmbedUrl] = useState("");
  const [videoError, setVideoError] = useState(false);

  const [captions, setCaptions] = useState([]);
  const [currentCaptionText, setCurrentCaptionText] = useState("");
  const [currentStartTime, setCurrentStartTime] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [activeCaption, setActiveCaption] = useState("");

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const timeCheckInterval = useRef(null);

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const detectVideoType = (url) => {
    if (!url) return "unknown";

    const lowercaseUrl = url.toLowerCase();

    if (
      lowercaseUrl.includes("youtube.com") ||
      lowercaseUrl.includes("youtu.be")
    ) {
      return "youtube";
    } else if (lowercaseUrl.includes("vimeo.com")) {
      return "vimeo";
    } else if (
      lowercaseUrl.includes("dailymotion.com") ||
      lowercaseUrl.includes("dai.ly")
    ) {
      return "dailymotion";
    } else if (
      lowercaseUrl.includes("facebook.com") &&
      lowercaseUrl.includes("video")
    ) {
      return "facebook";
    } else if (lowercaseUrl.includes("twitch.tv")) {
      return "twitch";
    } else {
      return "direct";
    }
  };

  const generateEmbedUrl = (url, type) => {
    switch (type) {
      case "youtube": {
        const regExp =
          /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = match && match[7].length === 11 ? match[7] : null;
        return videoId
          ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
          : null;
      }
      case "vimeo": {
        const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
        const match = url.match(regExp);
        const videoId = match ? match[1] : null;
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
      }
      case "dailymotion": {
        const regExp =
          /dailymotion.com\/(?:video\/|embed\/video\/)?([a-zA-Z0-9]+)/;
        const shortRegExp = /dai\.ly\/([a-zA-Z0-9]+)/;
        let match = url.match(regExp);
        if (!match) match = url.match(shortRegExp);
        const videoId = match ? match[1] : null;
        return videoId
          ? `https://www.dailymotion.com/embed/video/${videoId}`
          : null;
      }
      case "facebook": {
        return url;
      }
      case "twitch": {
        let embedUrl = null;
        if (url.includes("/videos/")) {
          const regExp = /twitch\.tv\/videos\/(\d+)/;
          const match = url.match(regExp);
          const videoId = match ? match[1] : null;
          if (videoId)
            embedUrl = `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}`;
        } else {
          const regExp = /twitch\.tv\/([a-zA-Z0-9_]+)/;
          const match = url.match(regExp);
          const channel = match ? match[1] : null;
          if (channel)
            embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
        }
        return embedUrl;
      }
      default:
        return null;
    }
  };

  const loadVideo = () => {
    if (!videoUrl) {
      alert("Please enter a video URL");
      return;
    }

    setVideoError(false);

    const type = detectVideoType(videoUrl);
    setVideoType(type);

    if (type !== "direct") {
      const embedUrlResult = generateEmbedUrl(videoUrl, type);

      if (embedUrlResult) {
        setEmbedUrl(embedUrlResult);
        setIsVideoLoaded(true);
      } else {
        alert(`Unable to parse ${type} URL. Please check the format.`);
      }
    } else {
      setIsVideoLoaded(true);
    }
  };

  useEffect(() => {
    if (!isVideoLoaded || videoType !== "youtube" || !embedUrl) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current);
      }
    };
  }, [isVideoLoaded, videoType, embedUrl]);

  useEffect(() => {
    if (!isVideoLoaded || videoType !== "direct" || !videoRef.current) return;

    const video = videoRef.current;

    if (video) {
      video.addEventListener("timeupdate", checkCaptionsDirectVideo);

      return () => {
        video.removeEventListener("timeupdate", checkCaptionsDirectVideo);
      };
    }
  }, [isVideoLoaded, videoType, captions]);

  const initializePlayer = () => {
    const iframe = document.getElementById("video-player-frame");
    if (!iframe) return;

    playerRef.current = new window.YT.Player("video-player-frame", {
      events: {
        onReady: onPlayerReady,
      },
    });
  };

  const onPlayerReady = () => {
    timeCheckInterval.current = setInterval(checkCaptionsYouTube, 50);
  };

  const handleSaveCaption = () => {
    if (!currentCaptionText.trim()) {
      alert("Please enter caption text");
      return;
    }

    const startTime = parseFloat(currentStartTime);
    const endTime = parseFloat(currentEndTime);

    if (isNaN(startTime) || isNaN(endTime)) {
      alert("Please enter valid start and end times");
      return;
    }

    if (startTime >= endTime) {
      alert("Start time must be less than end time");
      return;
    }

    const hasOverlap = captions.some((caption, index) => {
      if (editingIndex !== null && index === editingIndex) return false;

      return (
        (startTime >= caption.startTime && startTime < caption.endTime) ||
        (endTime > caption.startTime && endTime <= caption.endTime) ||
        (startTime <= caption.startTime && endTime >= caption.endTime)
      );
    });

    if (hasOverlap) {
      alert("This time range overlaps with an existing caption");
      return;
    }

    const newCaption = {
      text: currentCaptionText,
      startTime: startTime,
      endTime: endTime,
    };

    if (editingIndex !== null) {
      const updatedCaptions = [...captions];
      updatedCaptions[editingIndex] = newCaption;
      setCaptions(updatedCaptions);
      setEditingIndex(null);
    } else {
      setCaptions([...captions, newCaption]);
    }

    resetCaptionForm();
  };

  const resetCaptionForm = () => {
    setCurrentCaptionText("");
    setCurrentStartTime("");
    setCurrentEndTime("");
    setEditingIndex(null);
  };

  const handleEditCaption = (index) => {
    const caption = captions[index];
    setCurrentCaptionText(caption.text);
    setCurrentStartTime(caption.startTime.toString());
    setCurrentEndTime(caption.endTime.toString());
    setEditingIndex(index);
  };

  const handleDeleteCaption = (index) => {
    setCaptions(captions.filter((_, i) => i !== index));

    if (editingIndex === index) {
      resetCaptionForm();
    }
  };

  const setCurrentTimeAsStart = () => {
    let currentTime = 0;

    if (videoType === "youtube" && playerRef.current) {
      try {
        currentTime = playerRef.current.getCurrentTime();
      } catch (error) {
        console.error("Error getting current time from YouTube:", error);
        return;
      }
    } else if (videoType === "direct" && videoRef.current) {
      currentTime = videoRef.current.currentTime;
    } else {
      return;
    }

    setCurrentStartTime(currentTime.toFixed(1));
  };

  const setCurrentTimeAsEnd = () => {
    let currentTime = 0;

    if (videoType === "youtube" && playerRef.current) {
      try {
        currentTime = playerRef.current.getCurrentTime();
      } catch (error) {
        console.error("Error getting current time from YouTube:", error);
        return;
      }
    } else if (videoType === "direct" && videoRef.current) {
      currentTime = videoRef.current.currentTime;
    } else {
      return;
    }

    setCurrentEndTime(currentTime.toFixed(1));
  };

  const checkCaptionsYouTube = () => {
    if (playerRef.current) {
      try {
        const currentTime = playerRef.current.getCurrentTime();
        updateActiveCaption(currentTime);
      } catch (error) {}
    }
  };

  const checkCaptionsDirectVideo = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      updateActiveCaption(currentTime);
    }
  };

  useEffect(() => {
    if (isVideoLoaded && videoType === "youtube" && playerRef.current) {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current);
      }
      timeCheckInterval.current = setInterval(checkCaptionsYouTube, 50);

      return () => {
        if (timeCheckInterval.current) {
          clearInterval(timeCheckInterval.current);
        }
      };
    }
  }, [isVideoLoaded, videoType, captions]);

  const updateActiveCaption = (currentTime) => {
    const caption = captions.find(
      (cap) => currentTime >= cap.startTime && currentTime <= cap.endTime
    );

    setActiveCaption(caption ? caption.text : "");
  };

  const generateVTT = () => {
    const sortedCaptions = [...captions].sort(
      (a, b) => a.startTime - b.startTime
    );

    let vttContent = "WEBVTT\n\n";

    sortedCaptions.forEach((caption, index) => {
      const startFormatted = formatVTTTime(caption.startTime);
      const endFormatted = formatVTTTime(caption.endTime);

      vttContent += `${index + 1}\n`;
      vttContent += `${startFormatted} --> ${endFormatted}\n`;
      vttContent += `${caption.text}\n\n`;
    });

    return vttContent;
  };

  const formatVTTTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const secs = date.getUTCSeconds().toString().padStart(2, "0");
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");

    return `${hours}:${minutes}:${secs}.${milliseconds}`;
  };

  const downloadVTT = () => {
    if (captions.length === 0) {
      alert("No captions to download");
      return;
    }

    const vttContent = generateVTT();
    const blob = new Blob([vttContent], { type: "text/vtt" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "captions.vtt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDisplayTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Video Caption Editor</h1>

      <div style={styles.card}>
        <h2 style={styles.sectionHeader}>1. Enter Video URL</h2>
        <div style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
          Enter any video URL - direct video files or from platforms like
          YouTube, Vimeo, Dailymotion, etc.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: isMediumScreen ? "row" : "column",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Enter any video URL"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            style={{ ...styles.input, flex: 1 }}
          />
          <button
            onClick={loadVideo}
            style={{ ...styles.button, ...styles.primaryButton }}
          >
            Load Video
          </button>
        </div>
      </div>

      {isVideoLoaded && (
        <div style={styles.card}>
          <h2 style={styles.sectionHeader}>2. Preview Video</h2>
          <div style={styles.videoContainer}>
            {videoType !== "direct" ? (
              <iframe
                id="video-player-frame"
                src={embedUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                style={{ width: "100%", height: "100%" }}
                onError={() => {
                  setVideoError(true);
                  alert(
                    "Error loading video. Please check the URL and make sure the video format is supported by your browser."
                  );
                }}
                onLoadedData={() => setVideoError(false)}
              >
                Your browser does not support the video tag.
              </video>
            )}

            {activeCaption && (
              <div style={styles.captionOverlay}>
                <div style={styles.captionContent}>{activeCaption}</div>
              </div>
            )}
          </div>
          {videoError && (
            <div
              style={{
                marginTop: "10px",
                color: "#e74c3c",
                fontWeight: "bold",
              }}
            >
              Error loading video. Please check the URL and try again.
            </div>
          )}
        </div>
      )}

      {isVideoLoaded && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMediumScreen ? "1fr 1fr" : "1fr",
            gap: "20px",
          }}
        >
          <div style={styles.card}>
            <h2 style={styles.sectionHeader}>
              3. {editingIndex !== null ? "Edit Caption" : "Add Caption"}
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div style={styles.inputGroup}>
                <label style={styles.label}>Caption Text:</label>
                <textarea
                  value={currentCaptionText}
                  onChange={(e) => setCurrentCaptionText(e.target.value)}
                  style={styles.input}
                  rows="3"
                  placeholder="Enter caption text here..."
                ></textarea>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMediumScreen ? "1fr 1fr" : "1fr",
                  gap: "15px",
                }}
              >
                <div>
                  <label style={styles.label}>Start Time (sec):</label>
                  <div style={styles.flexRow}>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={currentStartTime}
                      onChange={(e) => setCurrentStartTime(e.target.value)}
                      style={{ ...styles.input, flex: 1 }}
                      placeholder="0.0"
                    />
                    <button
                      onClick={setCurrentTimeAsStart}
                      style={{ ...styles.button, ...styles.grayButton }}
                      disabled={!isVideoLoaded}
                    >
                      Set Current
                    </button>
                  </div>
                  {currentStartTime && (
                    <div style={styles.timeDisplay}>
                      Time: {formatDisplayTime(parseFloat(currentStartTime))}
                    </div>
                  )}
                </div>

                <div>
                  <label style={styles.label}>End Time (sec):</label>
                  <div style={styles.flexRow}>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={currentEndTime}
                      onChange={(e) => setCurrentEndTime(e.target.value)}
                      style={{ ...styles.input, flex: 1 }}
                      placeholder="0.0"
                    />
                    <button
                      onClick={setCurrentTimeAsEnd}
                      style={{ ...styles.button, ...styles.grayButton }}
                      disabled={!isVideoLoaded}
                    >
                      Set Current
                    </button>
                  </div>
                  {currentEndTime && (
                    <div style={styles.timeDisplay}>
                      Time: {formatDisplayTime(parseFloat(currentEndTime))}
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.flexRow}>
                <button
                  onClick={handleSaveCaption}
                  style={{
                    ...styles.button,
                    ...styles.greenButton,
                    flex: 1,
                  }}
                >
                  {editingIndex !== null ? "Update Caption" : "Add Caption"}
                </button>
                {editingIndex !== null && (
                  <button
                    onClick={resetCaptionForm}
                    style={{ ...styles.button, ...styles.grayButton }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.flexBetween}>
              <h2 style={styles.sectionHeader}>4. Manage Captions</h2>
            </div>

            {captions.length === 0 ? (
              <div style={styles.emptyState}>
                No captions added yet. Add your first caption using the form.
              </div>
            ) : (
              <div style={styles.captionsList}>
                {captions
                  .sort((a, b) => a.startTime - b.startTime)
                  .map((caption, index) => (
                    <div
                      key={index}
                      style={
                        editingIndex === index
                          ? styles.captionItemHighlighted
                          : styles.captionItem
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: isMediumScreen ? "row" : "column",
                          justifyContent: "space-between",
                          gap: "10px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={styles.captionTimestamp}>
                            {formatDisplayTime(caption.startTime)} -{" "}
                            {formatDisplayTime(caption.endTime)}
                          </div>
                          <div style={styles.captionText}>{caption.text}</div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: isMediumScreen ? 0 : "10px",
                          }}
                        >
                          <button
                            onClick={() => handleEditCaption(index)}
                            style={{
                              ...styles.button,
                              backgroundColor: "#3498db",
                              color: "white",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCaption(index)}
                            style={{
                              ...styles.button,
                              backgroundColor: "#e74c3c",
                              color: "white",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={styles.footer}>Video Caption Editor</div>
    </div>
  );
};

export default VideoCaptionEditor;
