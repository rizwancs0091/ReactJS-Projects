import React, { Component } from "react";
import "../Styles/videoplayer.css";
// import ReactVideoTrimmer from "react-video-trimmer";

//------------------------SPEECH RECOGNITION START-----------------------------

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// properties of recognition object
recognition.continous = true; //continuous results are returned for each recognition,
recognition.interimResults = true; //interim results should be returned (true) or not (false.)
recognition.lang = "en-US"; //returns and sets the language of the current SpeechRecognition.

//------------------------SPEECH RECOGNITION END-----------------------------

class VideoPlayer extends Component {
  constructor() {
    super();
    this.state = {
      listening: false,
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
  }

  // speech to text conversion starttttt

  toggleListen() {
    this.setState(
      {
        listening: !this.state.listening,
      },
      this.handleListen
    );
  }

  handleListen() {
    // console.log("listening?", this.state.listening);

    if (this.state.listening) {
      recognition.start();
      recognition.onend = () => {
        // console.log("...continue listening...");
        recognition.start();
      };
    } else {
      recognition.stop();
      recognition.onend = () => {
        // console.log("Stopped listening per click");
      };
    }

    recognition.onstart = () => {
      // console.log("Listening!");
    };

    let finalTranscript = "";
    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }
      document.getElementById("interim").innerHTML = interimTranscript;
      // document.getElementById("final").innerHTML = finalTranscript;

      //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(" ");
      const stopCmd = transcriptArr.slice(-3, -1);
      // console.log("stopCmd", stopCmd);

      if (stopCmd[0] === "stop" && stopCmd[1] === "listening") {
        recognition.stop();
        recognition.onend = () => {
          // console.log("Stopped listening per command");
          const finalText = transcriptArr.slice(0, -3).join(" ");
          document.getElementById("final").innerHTML = finalText;
        };
      }
    };

    //-----------------------------------------------------------------------

    recognition.onerror = (event) => {
      // console.log("Error occurred in recognition: " + event.error);
    };
  }

  // speech to text conversion endddddddd

  // ##########################################################################################

  // method to start the recording
  startButton() {
    let preview = document.getElementById("preview");
    let recording = document.getElementById("recording");
    let downloadButton = document.getElementById("downloadButton");
    let logElement = document.getElementById("log");
    let recordingTimeMS = 20000;

    const log = (msg) => {
      logElement.innerHTML += msg + "\n";
    };

    const wait = (delayInMS) => {
      return new Promise((resolve) => setTimeout(resolve, delayInMS));
    };

    const startRecording = (stream, lengthInMS) => {
      let recorder = new MediaRecorder(stream);
      let data = [];

      recorder.ondataavailable = (event) => data.push(event.data);
      recorder.start();
      // log(recorder.state + " for " + lengthInMS / 1000 + " seconds...");

      let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(event.name);
      });

      let recorded = wait(lengthInMS).then(
        () => recorder.state === "recording" && recorder.stop()
      );

      return Promise.all([stopped, recorded]).then(() => data);
    };

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        preview.srcObject = stream;
        downloadButton.href = stream;
        preview.captureStream =
          preview.captureStream || preview.mozCaptureStream;
        return new Promise((resolve) => (preview.onplaying = resolve));
      })
      .then(() => startRecording(preview.captureStream(), recordingTimeMS))
      .then((recordedChunks) => {
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        recording.src = URL.createObjectURL(recordedBlob);
        console.log(recording.src);

        downloadButton.href = recording.src;
        downloadButton.download = "RecordedVideo.webm";

        log(
          "Successfully recorded " +
            recordedBlob.size +
            " bytes of " +
            recordedBlob.type +
            " media."
        );
      })
      .catch(log);
    // Timer start
    var seconds = document.getElementById("countdown").textContent;
    var countdown = setInterval(function () {
      seconds--;
      seconds == 9
        ? (document.getElementById("plural").textContent = "")
        : (document.getElementById("plural").textContent = "s");
      document.getElementById("countdown").textContent = seconds;
      if (seconds <= 0) clearInterval(countdown);
    }, 1000);
    // Timer end
  }

  // method to stop the recording
  stopButton() {
    let preview = document.getElementById("preview");

    const stop = (stream) => {
      stream.getTracks().forEach((track) => track.stop());
    };

    stop(preview.srcObject);
  }

  render() {
    return (
      <div className="main">
        <div className="left">
          <div
            onClick={(e) => {
              this.toggleListen();
              this.startButton();
            }}
            id="startButton"
            className="button"
          >
            Start
          </div>
          <h2>Preview</h2>
          <video id="preview" width="500" height="450" autoPlay muted></video>

          <textarea id="interim"></textarea>
          {/* <textarea id="final"></textarea> */}

          <div className="button">
            <span id="countdown">20</span> second
            <span id="plural">s</span>
          </div>

          <canvas id="c1" width="160" height="96"></canvas>
          <canvas id="c2" width="160" height="96"></canvas>
        </div>
        <div className="right">
          <div onClick={this.stopButton} id="stopButton" className="button">
            Stop
          </div>
          <h2>Recording</h2>
          <video id="recording" width="500" height="450" controls></video>
          <a id="downloadButton" className="button">
            Download
          </a>
        </div>
        <div className="bottom">
          <pre id="log"></pre>
        </div>
      </div>
    );
  }
}

export default VideoPlayer;
