import React, { useState, useEffect, useRef, useTransition } from "react";
import { 
  Sparkles, 
  Play, 
  Pause, 
  Music, 
  Volume2, 
  Sliders, 
  RefreshCw, 
  Mic, 
  MicOff, 
  Download, 
  Trash2, 
  Save, 
  FileText, 
  MessageSquare, 
  CloudRain, 
  Info,
  FolderOpen,
  ArrowRight,
  Disc,
  X,
  Plus,
  HelpCircle,
  Lightbulb,
  Music4,
  Layers,
  VolumeX
} from "lucide-react";
import { ChatMessage, SoundPad, SavedProject, SavedRecording } from "./types";

// Standard color tags for pads
const CATEGORIES_COLOR = {
  "Beats": "from-rose-500 to-red-600 shadow-rose-500/20",
  "Bass": "from-cyan-500 to-blue-600 shadow-cyan-500/20",
  "Melody": "from-violet-500 to-purple-600 shadow-violet-500/20",
  "Synth": "from-amber-400 to-orange-500 shadow-amber-500/20",
  "Vocal FX": "from-emerald-400 to-teal-500 shadow-emerald-500/20"
};

const DEFAULT_PADS: SoundPad[] = [
  // BEATS (Rhythm grids)
  { id: "drum_kick", name: "Heavy 808 Kick", category: "Beats", color: "Beats", waveType: "sine", baseFreq: 55, rhythmPattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], isActive: false },
  { id: "drum_snare", name: "Solid Trap Snare", category: "Beats", color: "Beats", waveType: "triangle", baseFreq: 180, rhythmPattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], isActive: false },
  { id: "drum_hats", name: "High Trap Roll", category: "Beats", color: "Beats", waveType: "square", baseFreq: 800, rhythmPattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], isActive: false },
  { id: "drum_blue_monday", name: "Blue Monday Club Kick", category: "Beats", color: "Beats", waveType: "sine", baseFreq: 60, rhythmPattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], isActive: false },
  { id: "drum_snare_vintage", name: "Vintage Tape Snare", category: "Beats", color: "Beats", waveType: "triangle", baseFreq: 140, rhythmPattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], isActive: false },
  { id: "drum_rimshot", name: "Snap Rimshot Tap", category: "Beats", color: "Beats", waveType: "sine", baseFreq: 400, rhythmPattern: [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], isActive: false },
  { id: "drum_clapper", name: "Crisp Studio Clap", category: "Beats", color: "Beats", waveType: "triangle", baseFreq: 240, rhythmPattern: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0], isActive: false },
  
  // BASSES
  { id: "bass_deep", name: "Sub Resonance", category: "Bass", color: "Bass", waveType: "sine", baseFreq: 41, rhythmPattern: [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0], isActive: false },
  { id: "bass_acid", name: "Acid Plucky Bass", category: "Bass", color: "Bass", waveType: "sawtooth", baseFreq: 82, rhythmPattern: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], isActive: false },
  { id: "bass_billie_jean", name: "Billie Octave Bass", category: "Bass", color: "Bass", waveType: "square", baseFreq: 58.27, rhythmPattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], isActive: false },
  { id: "bass_seven_nation", name: "Army Anthem Rumble", category: "Bass", color: "Bass", waveType: "sawtooth", baseFreq: 55, rhythmPattern: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0], isActive: false },
  { id: "bass_slap", name: "Funk Slap Bass", category: "Bass", color: "Bass", waveType: "square", baseFreq: 55, rhythmPattern: [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0], isActive: false },
  { id: "bass_analog", name: "Warm Vintage Bass", category: "Bass", color: "Bass", waveType: "triangle", baseFreq: 65, rhythmPattern: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], isActive: false },
  
  // MELODIES
  { id: "melody_acoustic", name: "Lofi Acoustic Scale", category: "Melody", color: "Melody", waveType: "triangle", baseFreq: 220, rhythmPattern: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], isActive: false },
  { id: "melody_rhodes", name: "Dreamy Rhodes", category: "Melody", color: "Melody", waveType: "sine", baseFreq: 330, rhythmPattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], isActive: false },
  { id: "melody_trumpet_jazz", name: "Midnight Solo Trumpet", category: "Melody", color: "Melody", waveType: "sawtooth", baseFreq: 349.23, rhythmPattern: [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0], isActive: false },
  { id: "melody_uptown_brass", name: "Uptown Funk Brass", category: "Melody", color: "Melody", waveType: "sawtooth", baseFreq: 349.23, rhythmPattern: [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0], isActive: false },
  { id: "melody_trumpet_mute", name: "Muted Brass Stab", category: "Melody", color: "Melody", waveType: "triangle", baseFreq: 440, rhythmPattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], isActive: false },
  { id: "melody_chimes", name: "Cosmic Bell Chime", category: "Melody", color: "Melody", waveType: "sine", baseFreq: 987.77, rhythmPattern: [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0], isActive: false },
  { id: "melody_wind_chime", name: "Wind Chime Sparkle", category: "Melody", color: "Melody", waveType: "triangle", baseFreq: 1200, rhythmPattern: [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0], isActive: false },
  
  // SYNTH SHOTS
  { id: "synth_lead", name: "Hyperdrive Lead", category: "Synth", color: "Synth", waveType: "sawtooth", baseFreq: 440, rhythmPattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0], isActive: false },
  { id: "synth_still_dre", name: "Still Dre High Keys", category: "Synth", color: "Synth", waveType: "triangle", baseFreq: 880, rhythmPattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], isActive: false },
  { id: "synth_chord", name: "Ambient Pad Chord", category: "Synth", color: "Synth", waveType: "triangle", baseFreq: 261.63, rhythmPattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], isActive: false },
  { id: "synth_jazz_maj", name: "Soulful Maj7 Chord", category: "Synth", color: "Synth", waveType: "sine", baseFreq: 293.66, rhythmPattern: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], isActive: false },
  { id: "synth_neo_min", name: "Neo-Soul Min9 Chord", category: "Synth", color: "Synth", waveType: "triangle", baseFreq: 220, rhythmPattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], isActive: false },
  { id: "synth_chiptune", name: "Retro Chiptune Pluck", category: "Synth", color: "Synth", waveType: "square", baseFreq: 587.33, rhythmPattern: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], isActive: false },

  // VOCAL CUTS
  { id: "fx_laser", name: "Glitch Sweep Rise", category: "Vocal FX", color: "Vocal FX", waveType: "sawtooth", baseFreq: 350, rhythmPattern: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], isActive: false },
  { id: "vocal_yeah", name: "Yeah Chorus Chop", category: "Vocal FX", color: "Vocal FX", waveType: "sine", baseFreq: 440, rhythmPattern: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1], isActive: false },
  { id: "fx_uplifter", name: "Space Noise Climber", category: "Vocal FX", color: "Vocal FX", waveType: "sawtooth", baseFreq: 100, rhythmPattern: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], isActive: false }
];

export default function App() {
  const [pads, setPads] = useState<SoundPad[]>(DEFAULT_PADS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Audio Context and Synth parameters
  const [bpm, setBpm] = useState(110);
  const [isGridPlaying, setIsGridPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Lyrics panel
  const [lyricsText, setLyricsText] = useState(
    `[CHORUS]\nLet the waves flow right in our mind tonight\nWe make the melody together, everything is bright\nFrom the basement studio, rise to the stage\nJoules Music writing down a brand new page...\n\n[VERSE 1]\nPlug the mic in, listen to the loop delay\nHeartbeat ticking, we don't care what they say\nGot standard sub bass rumble keeping me warm\nCreating raw masterpieces right inside the storm.`
  );
  const [songTitle, setSongTitle] = useState("Untethered Soul");
  const [writingGenre, setWritingGenre] = useState("Chill Lofi Hip-Hop");
  const [writingTopic, setWritingTopic] = useState("Vulnerability & Success");
  const [writingTone, setWritingTone] = useState("Uplifting");
  const [writingKeywords, setWritingKeywords] = useState("dreaming, echo, rain, gold");
  
  // Coaching Chat Bot state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "coach",
      text: "Yo! Welcome to Joules Music Studio. 🎵 I'm Joules, your AI music coach. I can help you compile rhyme patterns, recommend backing BPM tempos, guide your vocal compression, or layout standard song structures. What kind of vibe are we making today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Audio recording & mic state
  const [isMicActive, setIsMicActive] = useState(false);
  const [isRecordingSession, setIsRecordingSession] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  // Saved tracks and local projects
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [savedRecordings, setSavedRecordings] = useState<SavedRecording[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [activeTab, setActiveTabTab] = useState<"coach" | "lyrics" | "projects">("coach");

  // Custom Beat imports
  const [importedBeatFile, setImportedBeatFile] = useState<File | null>(null);
  const [importedBeatName, setImportedBeatName] = useState<string | null>(null);
  const [importedBeatVolume, setImportedBeatVolume] = useState(70);
  const [isImportedPlaying, setIsImportedPlaying] = useState(false);
  
  // Custom Beat edit & manipulation states
  const [deckSpeed, setDeckSpeed] = useState(1.0);
  const [deckPitch, setDeckPitch] = useState(0); // cents (-1200 to +1200)
  const [deckLowpass, setDeckLowpass] = useState(20000); // 20Hz to 20000Hz
  const [deckHighpass, setDeckHighpass] = useState(20); // 20Hz to 15000Hz
  const [deckTrimStart, setDeckTrimStart] = useState(0); // %
  const [deckTrimEnd, setDeckTrimEnd] = useState(100); // %
  const [deckReverse, setDeckReverse] = useState(false);
  const [deckBassBoost, setDeckBassBoost] = useState(0); // dB (-12 to +12)

  // Vocal Processing FX States
  const [vocalAutoTuneActive, setVocalAutoTuneActive] = useState(false);
  const [vocalAutoTuneKey, setVocalAutoTuneKey] = useState("C");
  const [vocalAutoTuneScale, setVocalAutoTuneScale] = useState("Major");
  const [vocalAutoTuneSpeed, setVocalAutoTuneSpeed] = useState(60); // 0 (slow) to 100 (instant robot)
  
  const [vocalNoiseGateActive, setVocalNoiseGateActive] = useState(false);
  const [vocalNoiseGateThreshold, setVocalNoiseGateThreshold] = useState(-45); // dB
  const [vocalNoiseGateReduction, setVocalNoiseGateReduction] = useState(-40); // dB

  const [vocalClarityActive, setVocalClarityActive] = useState(true);
  const [vocalClarityLowCut, setVocalClarityLowCut] = useState(true);
  const [vocalClarityAirShelf, setVocalClarityAirShelf] = useState(6); // dB boost at 10kHz

  const [vocalLayeringActive, setVocalLayeringActive] = useState(false);
  const [vocalLayeringDelay, setVocalLayeringDelay] = useState(25); // ms (15 to 30)
  const [vocalLayeringDetune, setVocalLayeringDetune] = useState(15); // cents

  // Backing Track groove slicing & BPM sync
  const [backingTrackOriginalBPM, setBackingTrackOriginalBPM] = useState(120);
  const [bpmSyncActive, setBpmSyncActive] = useState(false);
  const [slicesCount, setSlicesCount] = useState<4 | 8 | 16>(8);
  const [slicesLayout, setSlicesLayout] = useState<{ start: number; end: number; index: number }[]>([]);
  const [activeSliceIndex, setActiveSliceIndex] = useState<number | null>(null);
  
  // Google Drive Simulation model
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [driveFiles] = useState([
    { name: "Durban_Sunset_Trap_Backing_120BPM.mp3", duration: "2:45", size: "6.3MB" },
    { name: "Melodic_Acoustic_Rhodes_Loop_98BPM.wav", duration: "1:30", size: "14.1MB" },
    { name: "Deep_Soul_808_Rumble_Bass_85BPM.mp3", duration: "3:05", size: "7.1MB" },
    { name: "Urban_Vocal_Choir_Hook_Backing_110BPM.wav", duration: "2:00", size: "22.5MB" }
  ]);

  // Transitions
  const [isGeneratingLyrics, startLyricsGeneration] = useTransition();
  const [isSendingChat, startChatSending] = useTransition();

  // Web Audio Web references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const schedulerTimerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const stepsPointerRef = useRef<number>(0);

  // Mixer nodes refs for live routing
  const synthGainNodeRef = useRef<GainNode | null>(null);
  const micStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micGainNodeRef = useRef<GainNode | null>(null);
  
  // Mic Vocal FX Nodes
  const compressorNodeRef = useRef<DynamicsCompressorNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);
  const delayGainRef = useRef<GainNode | null>(null);

  // Vocal Optimization & FX Chain Refs
  const vocalAutoTuneActiveRef = useRef<boolean>(false);
  const vocalAutoTuneKeyRef = useRef<string>("C");
  const vocalAutoTuneScaleRef = useRef<string>("Major");
  const vocalAutoTuneSpeedRef = useRef<number>(60);

  const vocalNoiseGateActiveRef = useRef<boolean>(false);
  const vocalNoiseGateThresholdRef = useRef<number>(-45);
  const vocalNoiseGateReductionRef = useRef<number>(-40);

  const vocalClarityActiveRef = useRef<boolean>(true);
  const vocalClarityLowCutRef = useRef<boolean>(true);
  const vocalClarityAirShelfRef = useRef<number>(6);

  const vocalLayeringActiveRef = useRef<boolean>(false);
  const vocalLayeringDelayRef = useRef<number>(25);
  const vocalLayeringDetuneRef = useRef<number>(15);

  const clarityLowCutFilterRef = useRef<BiquadFilterNode | null>(null);
  const clarityAirShelfFilterRef = useRef<BiquadFilterNode | null>(null);
  const vocalLayeringDelayNodeRef = useRef<DelayNode | null>(null);
  const vocalLayeringGainNodeRef = useRef<GainNode | null>(null);
  const vocalScriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayFeedbackGainRef = useRef<GainNode | null>(null);
  const reverbConvolverRef = useRef<ConvolverNode | null>(null);
  
  // Custom Beat playback Source Node
  const originalBeatBufferRef = useRef<AudioBuffer | null>(null);
  const customBeatAudioBufferRef = useRef<AudioBuffer | null>(null);
  const customBeatSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const customBeatGainNodeRef = useRef<GainNode | null>(null);
  const customBeatLowpassRef = useRef<BiquadFilterNode | null>(null);
  const customBeatHighpassRef = useRef<BiquadFilterNode | null>(null);
  const customBeatBassBoostRef = useRef<BiquadFilterNode | null>(null);

  // Session Recording variables
  const masterDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  // Live frequency visualization of mic/beat
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const [visualDataArr, setVisualDataArr] = useState<number[]>(Array(16).fill(5));
  const animationFrameRef = useRef<number | null>(null);

  // Settings
  const [reverbMix, setReverbMix] = useState(40); // 0 to 100
  const [delayFeedback, setDelayFeedback] = useState(30); // 0 to 100

  // Standard showcase key notice
  const [showcaseMessage, setShowcaseMessage] = useState<string | null>(null);

  // Fetch initial local projects & recordings from localStorage
  useEffect(() => {
    try {
      const storedProj = localStorage.getItem("joules_studio_projects");
      if (storedProj) setSavedProjects(JSON.parse(storedProj));

      const storedRec = localStorage.getItem("joules_studio_recordings");
      if (storedRec) setSavedRecordings(JSON.parse(storedRec));
    } catch (e) {
      console.error("Local storage lookup failed", e);
    }

    return () => {
      stopBeatsScheduler();
      stopVisualizerAnimation();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Update metronome speed on BPM adjustment
  useEffect(() => {
    if (audioCtxRef.current) {
      // Scheduler dynamically tracks the BPM state
    }
  }, [bpm]);

  // Real-time deck manipulation parameter updater
  useEffect(() => {
    if (audioCtxRef.current) {
      const actx = audioCtxRef.current;
      const t = actx.currentTime;
      if (customBeatLowpassRef.current) {
        customBeatLowpassRef.current.frequency.setValueAtTime(deckLowpass, t);
      }
      if (customBeatHighpassRef.current) {
        customBeatHighpassRef.current.frequency.setValueAtTime(deckHighpass, t);
      }
      if (customBeatBassBoostRef.current) {
        customBeatBassBoostRef.current.gain.setValueAtTime(deckBassBoost, t);
      }
      if (customBeatGainNodeRef.current) {
        customBeatGainNodeRef.current.gain.setValueAtTime(importedBeatVolume / 100, t);
      }
      if (customBeatSourceNodeRef.current) {
        try {
          customBeatSourceNodeRef.current.playbackRate.setValueAtTime(deckSpeed, t);
        } catch (_) {}
        try {
          customBeatSourceNodeRef.current.detune.setValueAtTime(deckPitch, t);
        } catch (_) {}
      }
    }
  }, [deckLowpass, deckHighpass, deckBassBoost, importedBeatVolume, deckSpeed, deckPitch]);

  // Sync vocal processing parameters to their respective Refs for low-latency thread safety
  useEffect(() => {
    vocalAutoTuneActiveRef.current = vocalAutoTuneActive;
    vocalAutoTuneKeyRef.current = vocalAutoTuneKey;
    vocalAutoTuneScaleRef.current = vocalAutoTuneScale;
    vocalAutoTuneSpeedRef.current = vocalAutoTuneSpeed;
  }, [vocalAutoTuneActive, vocalAutoTuneKey, vocalAutoTuneScale, vocalAutoTuneSpeed]);

  useEffect(() => {
    vocalNoiseGateActiveRef.current = vocalNoiseGateActive;
    vocalNoiseGateThresholdRef.current = vocalNoiseGateThreshold;
    vocalNoiseGateReductionRef.current = vocalNoiseGateReduction;
  }, [vocalNoiseGateActive, vocalNoiseGateThreshold, vocalNoiseGateReduction]);

  useEffect(() => {
    vocalClarityActiveRef.current = vocalClarityActive;
    vocalClarityLowCutRef.current = vocalClarityLowCut;
    vocalClarityAirShelfRef.current = vocalClarityAirShelf;
    if (audioCtxRef.current) {
      const t = audioCtxRef.current.currentTime;
      if (clarityLowCutFilterRef.current) {
        clarityLowCutFilterRef.current.frequency.setValueAtTime(vocalClarityLowCut ? 80 : 10, t);
      }
      if (clarityAirShelfFilterRef.current) {
        clarityAirShelfFilterRef.current.gain.setValueAtTime(vocalClarityActive ? vocalClarityAirShelf : 0, t);
      }
    }
  }, [vocalClarityActive, vocalClarityLowCut, vocalClarityAirShelf]);

  useEffect(() => {
    vocalLayeringActiveRef.current = vocalLayeringActive;
    vocalLayeringDelayRef.current = vocalLayeringDelay;
    vocalLayeringDetuneRef.current = vocalLayeringDetune;
    if (audioCtxRef.current) {
      const t = audioCtxRef.current.currentTime;
      if (vocalLayeringDelayNodeRef.current) {
        vocalLayeringDelayNodeRef.current.delayTime.setValueAtTime(vocalLayeringActive ? vocalLayeringDelay / 1000 : 0, t);
      }
      if (vocalLayeringGainNodeRef.current) {
        vocalLayeringGainNodeRef.current.gain.setValueAtTime(vocalLayeringActive ? 0.6 : 0.0, t);
      }
    }
  }, [vocalLayeringActive, vocalLayeringDelay, vocalLayeringDetune]);

  // Backing Track Automatic BPM synchronization
  useEffect(() => {
    if (bpmSyncActive && backingTrackOriginalBPM > 0) {
      const scaleRatio = bpm / backingTrackOriginalBPM;
      setDeckSpeed(scaleRatio);
      // Detune by inverse cents ratio to automatically undo the pitch change of speed changes
      const correctiveDetuneCents = Math.round(-1200 * Math.log2(scaleRatio));
      setDeckPitch(correctiveDetuneCents);
    }
  }, [bpm, bpmSyncActive, backingTrackOriginalBPM]);

  // Lazy initialize AudioContext
  const initAudio = () => {
    if (!audioCtxRef.current) {
      // Create flexible fallback for cross-browser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const actx = new AudioCtx();
      audioCtxRef.current = actx;

      // Master record destination to pipe all streams recursively
      const masterDest = actx.createMediaStreamDestination();
      masterDestinationRef.current = masterDest;

      // Master output Node for synthesizer loops
      const synthGain = actx.createGain();
      synthGain.gain.setValueAtTime(0.7, actx.currentTime);
      synthGain.connect(actx.destination);
      synthGain.connect(masterDest);
      synthGainNodeRef.current = synthGain;

      // Custom backing track gain
      const customBeatGain = actx.createGain();
      customBeatGain.gain.setValueAtTime(importedBeatVolume / 100, actx.currentTime);
      customBeatGain.connect(actx.destination);
      customBeatGain.connect(masterDest);
      customBeatGainNodeRef.current = customBeatGain;

      // Incept custom deck filters
      const lowpass = actx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(deckLowpass, actx.currentTime);
      customBeatLowpassRef.current = lowpass;

      const highpass = actx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.setValueAtTime(deckHighpass, actx.currentTime);
      customBeatHighpassRef.current = highpass;

      const bassBoost = actx.createBiquadFilter();
      bassBoost.type = "lowshelf";
      bassBoost.frequency.setValueAtTime(100, actx.currentTime);
      bassBoost.gain.setValueAtTime(deckBassBoost, actx.currentTime);
      customBeatBassBoostRef.current = bassBoost;

      // Connect deck pipeline: lowpass -> highpass -> bassBoost -> gain
      lowpass.connect(highpass);
      highpass.connect(bassBoost);
      bassBoost.connect(customBeatGain);

      // Analyser Node for live animation peaks
      const analyser = actx.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(actx.destination);
      analyserNodeRef.current = analyser;

      // Set up Microphone route with Vocal FX chain
      const micGain = actx.createGain();
      micGain.gain.setValueAtTime(0.8, actx.currentTime);
      micGainNodeRef.current = micGain;

      const dynamicCompressor = actx.createDynamicsCompressor();
      dynamicCompressor.threshold.setValueAtTime(-35, actx.currentTime);
      dynamicCompressor.knee.setValueAtTime(30, actx.currentTime);
      dynamicCompressor.ratio.setValueAtTime(12, actx.currentTime);
      dynamicCompressor.attack.setValueAtTime(0.003, actx.currentTime);
      dynamicCompressor.release.setValueAtTime(0.25, actx.currentTime);
      compressorNodeRef.current = dynamicCompressor;

      // 1. Parametric Clarity Filters EQ Nodes (Clarity filters)
      const lowCutFilter = actx.createBiquadFilter();
      lowCutFilter.type = "highpass";
      lowCutFilter.frequency.setValueAtTime(vocalClarityLowCut ? 80 : 10, actx.currentTime);
      clarityLowCutFilterRef.current = lowCutFilter;

      const airShelfFilter = actx.createBiquadFilter();
      airShelfFilter.type = "highshelf";
      airShelfFilter.frequency.setValueAtTime(10000, actx.currentTime);
      airShelfFilter.gain.setValueAtTime(vocalClarityActive ? vocalClarityAirShelf : 0, actx.currentTime);
      clarityAirShelfFilterRef.current = airShelfFilter;

      // 2. High-Performance Low-Latency ScriptProcessor Vocal Core (Pitch Correction + Noise Gate)
      let targetRatio = 1.0;
      let gateCurrentVolume = 1.0;
      
      const pitchDelayBufSize = 16384;
      const pitchDelayBuf = new Float32Array(pitchDelayBufSize);
      let pitchWritePtr = 0;
      let sweepPhase = 0.0;

      // Fast autocorrelation sub-algorithm inside the processing thread context
      const autoCorrelateVocal = (buf: Float32Array, sampleRate: number): number => {
        let sumSquare = 0;
        const scanLen = Math.min(512, buf.length);
        for (let i = 0; i < scanLen; i++) {
          sumSquare += buf[i] * buf[i];
        }
        const rms = Math.sqrt(sumSquare / scanLen);
        if (rms < 0.008) return -1; // noisegate threshold or too quiet for tracking

        const minLag = Math.floor(sampleRate / 800); // 800Hz limit
        const maxLag = Math.ceil(sampleRate / 80);   // 80Hz limit
        let bestLag = -1;
        let bestCorr = -1;

        for (let lag = minLag; lag < maxLag; lag++) {
          let corr = 0;
          for (let i = 0; i < scanLen; i++) {
            corr += buf[i] * buf[i + lag];
          }
          if (corr > bestCorr) {
            bestCorr = corr;
            bestLag = lag;
          }
        }
        return bestLag > -1 ? sampleRate / bestLag : -1;
      };

      const vocalProcessor = actx.createScriptProcessor(2048, 1, 1);
      vocalScriptProcessorRef.current = vocalProcessor;

      vocalProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const outputData = e.outputBuffer.getChannelData(0);
        const sampleRate = actx.sampleRate;

        // Perform noise gate on passive envelope
        let rmsSum = 0;
        for (let i = 0; i < inputData.length; i++) {
          rmsSum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(rmsSum / inputData.length);
        const db = 20 * Math.log10(rms + 1e-6);

        const gateActive = vocalNoiseGateActiveRef.current;
        const gateThreshold = vocalNoiseGateThresholdRef.current;
        const reductionDb = vocalNoiseGateReductionRef.current;
        const reductionGain = Math.pow(10, reductionDb / 20);

        let targetGate = 1.0;
        if (gateActive && db < gateThreshold) {
          targetGate = reductionGain;
        }
        const smoothing = targetGate > gateCurrentVolume ? 0.25 : 0.02; // fast-attack slow-release
        gateCurrentVolume += (targetGate - gateCurrentVolume) * smoothing;

        // Run Autocorrelation AutoTune
        if (vocalAutoTuneActiveRef.current) {
          const fIn = autoCorrelateVocal(inputData, sampleRate);
          if (fIn > 0) {
            const midi = 12 * Math.log2(fIn / 440) + 69;
            const KEY_OFFSETS: Record<string, number> = {
              "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11
            };
            const SCALE_INTERVALS: Record<string, number[]> = {
              Major: [0, 2, 4, 5, 7, 9, 11],
              Minor: [0, 2, 3, 5, 7, 8, 10],
              Pentatonic: [0, 2, 4, 7, 9],
              Chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            };
            const targetOffset = KEY_OFFSETS[vocalAutoTuneKeyRef.current] || 0;
            const targetIntervals = SCALE_INTERVALS[vocalAutoTuneScaleRef.current] || SCALE_INTERVALS.Major;

            const midiRound = Math.round(midi);
            let bestDiff = 999;
            let targetMidi = midiRound;

            for (let cand = midiRound - 6; cand <= midiRound + 6; cand++) {
              const noteInOctave = (cand - targetOffset + 120) % 12;
              if (targetIntervals.includes(noteInOctave)) {
                const diff = Math.abs(cand - midi);
                if (diff < bestDiff) {
                  bestDiff = diff;
                  targetMidi = cand;
                }
              }
            }

            const fTarget = 440 * Math.pow(2, (targetMidi - 69) / 12);
            const ratio = fTarget / fIn;
            const speedCoeff = vocalAutoTuneSpeedRef.current / 100;
            targetRatio = targetRatio + (ratio - targetRatio) * speedCoeff;
          } else {
            targetRatio = targetRatio + (1.0 - targetRatio) * 0.1; // decay back to 1.0 when silent
          }
        } else {
          targetRatio = 1.0;
        }

        // Processing loop
        for (let i = 0; i < inputData.length; i++) {
          if (!vocalAutoTuneActiveRef.current) {
            outputData[i] = inputData[i] * gateCurrentVolume;
          } else {
            pitchDelayBuf[pitchWritePtr] = inputData[i];

            const sweepPeriod = 2048;
            const sweepRate = (1.0 - targetRatio) / sweepPeriod;
            sweepPhase += sweepRate;
            if (sweepPhase < 0) sweepPhase += 1.0;
            if (sweepPhase >= 1.0) sweepPhase -= 1.0;

            const delayA = sweepPhase * 1024;
            const readA = (pitchWritePtr - Math.floor(delayA) + pitchDelayBufSize) % pitchDelayBufSize;
            const sampleA = pitchDelayBuf[readA];

            const phaseB = (sweepPhase + 0.5) % 1.0;
            const delayB = phaseB * 1024;
            const readB = (pitchWritePtr - Math.floor(delayB) + pitchDelayBufSize) % pitchDelayBufSize;
            const sampleB = pitchDelayBuf[readB];

            const gainA = 0.5 + 0.5 * Math.cos(2 * Math.PI * (sweepPhase - 0.5));
            const gainB = 1.0 - gainA;

            const shiftedSample = sampleA * gainA + sampleB * gainB;
            outputData[i] = shiftedSample * gateCurrentVolume;

            pitchWritePtr = (pitchWritePtr + 1) % pitchDelayBufSize;
          }
        }
      };

      // 3. Connect Processing pipeline:
      // micGain -> vocalScriptProcessor -> EQ filters -> Compressor
      micGain.connect(vocalProcessor);
      vocalProcessor.connect(lowCutFilter);
      lowCutFilter.connect(airShelfFilter);
      airShelfFilter.connect(dynamicCompressor);

      dynamicCompressor.connect(analyser); // pipeline analysis peaks

      // 4. Multi-channel effect sends split from Compressor output
      // Split A: Direct Output
      const directGainNode = actx.createGain();
      directGainNode.gain.setValueAtTime(0.7, actx.currentTime);
      dynamicCompressor.connect(directGainNode);
      directGainNode.connect(actx.destination);
      directGainNode.connect(masterDest);

      // Split B: Glacier Feedback delay
      const delayNode = actx.createDelay();
      delayNode.delayTime.setValueAtTime(0.35, actx.currentTime);
      const delayFeedbackNode = actx.createGain();
      delayFeedbackNode.gain.setValueAtTime(delayFeedback / 100 * 0.7, actx.currentTime);
      
      delayNode.connect(delayFeedbackNode);
      delayFeedbackNode.connect(delayNode);
      
      const sendDelayGain = actx.createGain();
      sendDelayGain.gain.setValueAtTime(delayFeedback / 100, actx.currentTime);
      delayGainRef.current = sendDelayGain;

      dynamicCompressor.connect(delayNode);
      delayNode.connect(sendDelayGain);
      sendDelayGain.connect(actx.destination);
      sendDelayGain.connect(masterDest);

      // Split C: Cathedral Reverb Convolver
      const reverbConvolver = actx.createConvolver();
      // On-the-fly programmatic generation of Catedral decay impulse response
      try {
        const rate = actx.sampleRate;
        const decayLen = rate * 2.5; // 2.5 seconds cathedral space sound
        const reverbBuffer = actx.createBuffer(2, decayLen, rate);
        for (let ch = 0; ch < 2; ch++) {
          const chData = reverbBuffer.getChannelData(ch);
          for (let sIdx = 0; sIdx < decayLen; sIdx++) {
            const relativeTime = sIdx / rate;
            chData[sIdx] = (Math.random() * 2 - 1) * Math.pow(1 - relativeTime / 2.5, 2.0);
          }
        }
        reverbConvolver.buffer = reverbBuffer;
      } catch (err) {
        console.error("Synthesizing convolution buffer failed", err);
      }
      reverbConvolverRef.current = reverbConvolver;

      const reverbMixGain = actx.createGain();
      reverbMixGain.gain.setValueAtTime(reverbMix / 100, actx.currentTime);
      reverbGainRef.current = reverbMixGain;

      dynamicCompressor.connect(reverbConvolver);
      reverbConvolver.connect(reverbMixGain);
      reverbMixGain.connect(actx.destination);
      reverbMixGain.connect(masterDest);

      // Split D: Vocal Layering Doubler chorus path (micro-delay + detuning LFO)
      const layeringDelay = actx.createDelay();
      layeringDelay.delayTime.setValueAtTime(vocalLayeringDelay / 1000, actx.currentTime);
      vocalLayeringDelayNodeRef.current = layeringDelay;

      // Dynamic LFO to modulate delay times and create dynamic detuning
      const layeringLfo = actx.createOscillator();
      layeringLfo.type = "sine";
      layeringLfo.frequency.setValueAtTime(3.0, actx.currentTime); // 3Hz speed modulation

      const layeringLfoDepth = actx.createGain();
      layeringLfoDepth.gain.setValueAtTime(0.002, actx.currentTime); // 2ms modulation depth (detuning)

      layeringLfo.connect(layeringLfoDepth);
      layeringLfoDepth.connect(layeringDelay.delayTime);
      layeringLfo.start();

      const layeringGain = actx.createGain();
      layeringGain.gain.setValueAtTime(vocalLayeringActive ? 0.6 : 0.0, actx.currentTime);
      vocalLayeringGainNodeRef.current = layeringGain;

      dynamicCompressor.connect(layeringDelay);
      layeringDelay.connect(layeringGain);
      layeringGain.connect(actx.destination);
      layeringGain.connect(masterDest);

      startVisualizerAnimation();
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Live Sound Wave Vis Animation
  const startVisualizerAnimation = () => {
    if (!analyserNodeRef.current) return;
    const bufferLength = analyserNodeRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserNodeRef.current) return;
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserNodeRef.current.getByteFrequencyData(dataArray);

      // Reduce to 16 intervals for display
      const peaks: number[] = [];
      const step = Math.floor(bufferLength / 16) || 1;
      for (let i = 0; i < 16; i++) {
        let val = dataArray[i * step] || 10;
        // Normalize val for percentage height
        val = Math.max(8, Math.floor((val / 255) * 100));
        peaks.push(val);
      }
      setVisualDataArr(peaks);
    };
    draw();
  };

  const stopVisualizerAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // WEB AUDIO BEAT SEQUENCER & SYNTHESIS
  const playSinglePadSound = (pad: SoundPad, time: number, step: number) => {
    if (!audioCtxRef.current) return;
    const actx = audioCtxRef.current;
    let duration = 0.15;
    let pitch = pad.baseFreq;

    if (pad.category === "Beats") {
      if (pad.id === "drum_kick") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(pitch, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
        duration = 0.22;
        gain.gain.setValueAtTime(1.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        
        osc.start(time);
        osc.stop(time + duration);
      } else if (pad.id === "drum_blue_monday") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        const clickOsc = actx.createOscillator();
        const clickGain = actx.createGain();

        osc.connect(gain);
        clickOsc.connect(clickGain);
        if (synthGainNodeRef.current) {
          gain.connect(synthGainNodeRef.current);
          clickGain.connect(synthGainNodeRef.current);
        }

        osc.type = "sine";
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.exponentialRampToValueAtTime(45, time + 0.1);

        gain.gain.setValueAtTime(1.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

        clickOsc.type = "triangle";
        clickOsc.frequency.setValueAtTime(800, time);
        clickOsc.frequency.exponentialRampToValueAtTime(150, time + 0.02);
        clickGain.gain.setValueAtTime(0.4, time);
        clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.start(time);
        osc.stop(time + 0.18);
        clickOsc.start(time);
        clickOsc.stop(time + 0.03);
        duration = 0.18;
      } else if (pad.id === "drum_snare") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(pitch, time);
        osc.frequency.setValueAtTime(pitch * 1.5, time + 0.02);
        duration = 0.12;
        gain.gain.setValueAtTime(0.8, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

        osc.start(time);
        osc.stop(time + duration);
      } else if (pad.id === "drum_snare_vintage") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        const filter = actx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(pitch, time);
        osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);
        
        filter.type = "highpass";
        filter.frequency.setValueAtTime(180, time);

        duration = 0.16;
        gain.gain.setValueAtTime(0.65, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

        osc.start(time);
        osc.stop(time + duration);
      } else if (pad.id === "drum_rimshot") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        osc.type = "sine";
        osc.frequency.setValueAtTime(pitch, time);
        duration = 0.04;
        gain.gain.setValueAtTime(0.7, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

        osc.start(time);
        osc.stop(time + duration);
      } else if (pad.id === "drum_clapper") {
        const playClapPulse = (delay: number, volume: number) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          const filter = actx.createBiquadFilter();
          
          osc.connect(filter);
          filter.connect(gain);
          if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

          osc.type = "triangle";
          osc.frequency.setValueAtTime(pitch + (Math.random() * 300 - 150), time + delay);
          
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(1200, time + delay);
          filter.Q.setValueAtTime(3, time + delay);

          gain.gain.setValueAtTime(volume, time + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, time + delay + 0.05);

          osc.start(time + delay);
          osc.stop(time + delay + 0.06);
        };

        playClapPulse(0, 0.4);
        playClapPulse(0.012, 0.5);
        playClapPulse(0.024, 0.6);
      } else {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        osc.type = "square";
        osc.frequency.setValueAtTime(pitch + Math.random() * 200, time);
        duration = 0.05;
        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        osc.start(time);
        osc.stop(time + duration);
      }
    } else if (pad.category === "Bass") {
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.connect(gain);
      if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

      osc.type = pad.waveType;
      osc.frequency.setValueAtTime(pitch, time);

      if (pad.id === "bass_acid") {
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, time + 0.15);
        duration = 0.28;
        gain.gain.setValueAtTime(0.7, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.26);
        
        osc.start(time);
        osc.stop(time + duration);
      } else if (pad.id === "bass_billie_jean") {
        const f0 = pitch; // root
        const octFreq = (step % 2 === 0) ? f0 : f0 * 2;
        osc.type = "square";
        osc.frequency.setValueAtTime(octFreq, time);

        const filter = actx.createBiquadFilter();
        osc.disconnect(gain);
        osc.connect(filter);
        filter.connect(gain);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(250, time);

        duration = 0.14;
        gain.gain.setValueAtTime(0.75, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

        osc.start(time);
        osc.stop(time + duration);
      } else if (pad.id === "bass_seven_nation") {
        const notes = [0, 0, 3, 0, -2, -4, -5, -5];
        const index = Math.floor(step / 2) % notes.length;
        const interval = notes[index];
        const noteFreq = pitch * Math.pow(1.05946, interval);

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(noteFreq, time);

        const filter = actx.createBiquadFilter();
        osc.disconnect(gain);
        osc.connect(filter);
        filter.connect(gain);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(180, time);

        duration = 0.22;
        gain.gain.setValueAtTime(0.85, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

        osc.start(time);
        osc.stop(time + duration);
      } else if (pad.id === "bass_slap") {
        const filter = actx.createBiquadFilter();
        osc.disconnect(gain);
        osc.connect(filter);
        filter.connect(gain);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, time);
        filter.frequency.exponentialRampToValueAtTime(150, time + 0.12);

        duration = 0.22;
        gain.gain.setValueAtTime(0.85, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        
        osc.start(time);
        osc.stop(time + duration);
      } else if (pad.id === "bass_analog") {
        duration = 0.45;
        gain.gain.setValueAtTime(0.65, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.43);
        
        osc.start(time);
        osc.stop(time + duration);
      } else {
        duration = 0.35;
        gain.gain.setValueAtTime(0.75, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.33);
        
        osc.start(time);
        osc.stop(time + duration);
      }
    } else if (pad.category === "Melody") {
      if (pad.id === "melody_trumpet_jazz") {
        const osc1 = actx.createOscillator();
        const osc2 = actx.createOscillator();
        const gain = actx.createGain();
        const filter = actx.createBiquadFilter();

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        const scaleSteps = [0, 2, 4, 7, 9, 12, 7, 4];
        const choice = scaleSteps[step % scaleSteps.length];
        const noteFreq = pitch * Math.pow(1.05946, choice);

        const slurStart = noteFreq * 0.94;
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(slurStart, time);
        osc1.frequency.linearRampToValueAtTime(noteFreq, time + 0.08);

        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(slurStart + 3, time);
        osc2.frequency.linearRampToValueAtTime(noteFreq + 3, time + 0.08);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1600, time);
        filter.frequency.exponentialRampToValueAtTime(650, time + 0.28);
        filter.Q.setValueAtTime(2, time);

        duration = 0.4;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.5, time + 0.03); 
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + duration);
        osc2.stop(time + duration);
      } else if (pad.id === "melody_uptown_brass") {
        const osc1 = actx.createOscillator();
        const osc2 = actx.createOscillator();
        const gain = actx.createGain();
        const filter = actx.createBiquadFilter();

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        const base = pitch;
        const chordStep = step % 4 === 0 ? base : step % 4 === 2 ? base * 1.1222 : base * 1.2599;
        
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(chordStep, time);
        osc1.frequency.linearRampToValueAtTime(chordStep + 4, time + 0.1);

        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(chordStep * 1.498, time); // fifth
        osc2.frequency.linearRampToValueAtTime(chordStep * 1.498 + 4, time + 0.1);

        filter.type = "peaking";
        filter.frequency.setValueAtTime(1500, time);
        filter.Q.setValueAtTime(3, time);
        filter.gain.setValueAtTime(8, time);

        duration = 0.15;
        gain.gain.setValueAtTime(0.55, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + duration);
        osc2.stop(time + duration);
      } else if (pad.id === "melody_trumpet_mute") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        const filter = actx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        const scaleSteps = [0, 4, 7, 11, 12, 11, 7, 4];
        const choice = scaleSteps[step % scaleSteps.length];
        const noteFreq = pitch * Math.pow(1.05946, choice);

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(noteFreq, time);

        filter.type = "peaking";
        filter.frequency.setValueAtTime(1400, time);
        filter.Q.setValueAtTime(5, time);
        filter.gain.setValueAtTime(12, time);

        duration = 0.25;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.4, time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.start(time);
        osc.stop(time + duration);
      } else if (pad.id === "melody_chimes") {
        const oscRoot = actx.createOscillator();
        const oscOver1 = actx.createOscillator();
        const oscOver2 = actx.createOscillator();
        const gain = actx.createGain();

        oscRoot.connect(gain);
        oscOver1.connect(gain);
        oscOver2.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        const scaleSteps = [0, 4, 7, 12, 14, 16, 19, 24];
        const choice = scaleSteps[(step * 2) % scaleSteps.length];
        const f0 = pitch * Math.pow(1.05946, choice);

        oscRoot.type = "sine";
        oscRoot.frequency.setValueAtTime(f0, time);

        oscOver1.type = "sine";
        oscOver1.frequency.setValueAtTime(f0 * 2.22, time); 

        oscOver2.type = "sine";
        oscOver2.frequency.setValueAtTime(f0 * 4.35, time); 

        duration = 0.6;
        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.58);

        oscRoot.start(time);
        oscOver1.start(time);
        oscOver2.start(time);

        oscRoot.stop(time + duration);
        oscOver1.stop(time + duration);
        oscOver2.stop(time + duration);
      } else if (pad.id === "melody_wind_chime") {
        const osc1 = actx.createOscillator();
        const osc2 = actx.createOscillator();
        const gain = actx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        const randomF1 = pitch + (Math.sin(step) * 200);
        const randomF2 = pitch * 1.5 + (Math.cos(step) * 150);

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(randomF1, time);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(randomF2, time);

        duration = 0.45;
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.43);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + duration);
        osc2.stop(time + duration);
      } else {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        osc.type = pad.waveType;
        const rootNote = pad.baseFreq;
        const scaleSteps = [0, 2, 4, 7, 9, 12, 14, 16];
        const choice = scaleSteps[(step * 3) % scaleSteps.length];
        const noteFreq = rootNote * Math.pow(1.05946, choice);
        osc.frequency.setValueAtTime(noteFreq, time);
        
        duration = 0.35;
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.33);

        osc.start(time);
        osc.stop(time + duration);
      }
    } else if (pad.category === "Synth") {
      if (pad.id === "synth_still_dre") {
        const root = pitch; // 880Hz or so
        const chord = (step % 8 < 6) ? [root, root * 1.25, root * 1.5] : [root * 0.95, root * 1.12, root * 1.43];
        const oscillators: OscillatorNode[] = [];
        const gain = actx.createGain();
        gain.connect(synthGainNodeRef.current || actx.destination);

        chord.forEach((freq) => {
          const o = actx.createOscillator();
          o.type = "triangle";
          o.frequency.setValueAtTime(freq, time);
          o.connect(gain);
          oscillators.push(o);
        });

        duration = 0.12;
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        oscillators.forEach(o => o.start(time));
        oscillators.forEach(o => o.stop(time + duration));
      } else if (pad.id === "synth_jazz_maj") {
        const rootNote = pitch;
        const chordRatios = [1.0, 1.25, 1.5, 1.875, 2.25];
        const oscillators: OscillatorNode[] = [];
        const gain = actx.createGain();
        gain.connect(synthGainNodeRef.current || actx.destination);

        chordRatios.forEach((ratio) => {
          const o = actx.createOscillator();
          o.type = "triangle"; 
          o.frequency.setValueAtTime(rootNote * ratio, time);
          o.connect(gain);
          oscillators.push(o);
        });

        duration = 0.65;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.05); 
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.62);

        oscillators.forEach(o => o.start(time));
        oscillators.forEach(o => o.stop(time + duration));
      } else if (pad.id === "synth_neo_min") {
        const rootNote = pitch;
        const chordRatios = [1.0, 1.2, 1.5, 1.8, 2.25];
        const oscillators: OscillatorNode[] = [];
        const gain = actx.createGain();
        gain.connect(synthGainNodeRef.current || actx.destination);

        chordRatios.forEach((ratio) => {
          const o = actx.createOscillator();
          o.type = "triangle";
          o.frequency.setValueAtTime(rootNote * ratio, time);
          o.connect(gain);
          oscillators.push(o);
        });

        duration = 0.65;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.05); 
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.62);

        oscillators.forEach(o => o.start(time));
        oscillators.forEach(o => o.stop(time + duration));
      } else if (pad.id === "synth_chiptune") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        osc.type = "square";
        osc.frequency.setValueAtTime(pitch, time);
        osc.frequency.setValueAtTime(pitch * 1.5, time + 0.03);
        osc.frequency.setValueAtTime(pitch * 2.0, time + 0.06);

        duration = 0.09;
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        osc.start(time);
        osc.stop(time + duration);
      } else {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

        osc.type = pad.waveType;
        const rootNote = pad.baseFreq;
        const stepOffset = step % 4 === 0 ? 0 : step % 4 === 2 ? 5 : 7;
        osc.frequency.setValueAtTime(rootNote * Math.pow(1.05946, stepOffset), time);
        duration = 0.3;
        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

        osc.start(time);
        osc.stop(time + duration);
      }
    } else {
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.connect(gain);
      if (synthGainNodeRef.current) gain.connect(synthGainNodeRef.current);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(pitch, time);

      if (pad.id === "fx_uplifter") {
        osc.frequency.linearRampToValueAtTime(pitch * 6.0, time + 0.8);
        duration = 0.85;
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.82);
      } else {
        osc.frequency.linearRampToValueAtTime(pitch * (1 + step * 0.25), time + 0.4);
        duration = 0.45;
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.43);
      }

      osc.start(time);
      osc.stop(time + duration);
    }
  };

  // Schedule a note trigger
  const playStepInstruments = (step: number, time: number) => {
    pads.forEach((pad) => {
      if (pad.isActive && pad.rhythmPattern[step] === 1) {
        playSinglePadSound(pad, time, step);
      }
    });
  };

  // Dynamic loops queue scheduler
  const triggerBeatsLoop = () => {
    if (!audioCtxRef.current) return;
    
    const timeInterval = 60.0 / bpm / 4; // 16th Note Speed duration
    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + 0.1) {
      playStepInstruments(stepsPointerRef.current, nextNoteTimeRef.current);
      
      // Move step counter
      const currentTick = stepsPointerRef.current;
      nextNoteTimeRef.current += timeInterval;
      
      // Trigger callback to highlight UI beats
      setTimeout(() => {
        setCurrentStep(currentTick);
      }, (nextNoteTimeRef.current - audioCtxRef.current.currentTime) * 1000);

      stepsPointerRef.current = (stepsPointerRef.current + 1) % 16;
    }

    schedulerTimerRef.current = window.setTimeout(triggerBeatsLoop, 25);
  };

  const startBeatsScheduler = () => {
    initAudio();
    if (!audioCtxRef.current) return;

    nextNoteTimeRef.current = audioCtxRef.current.currentTime;
    stepsPointerRef.current = 0;
    setIsGridPlaying(true);
    triggerBeatsLoop();
  };

  const stopBeatsScheduler = () => {
    if (schedulerTimerRef.current) {
      clearTimeout(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
    setIsGridPlaying(false);
    setCurrentStep(0);
  };

  // Toggle grid trigger
  const handleToggleGridSequencePlay = () => {
    initAudio();
    if (isGridPlaying) {
      stopBeatsScheduler();
    } else {
      startBeatsScheduler();
    }
  };

  // Toggle loops categories instantly
  const handleTogglePad = (id: string) => {
    initAudio();

    setPads(prev => prev.map(pad => {
      if (pad.id === id) {
        const nextActive = !pad.isActive;
        if (nextActive && audioCtxRef.current) {
          // Play the sound instantly at current context time
          playSinglePadSound(pad, audioCtxRef.current.currentTime, currentStep);
        }
        return { ...pad, isActive: nextActive };
      }
      return pad;
    }));
  };

  const handleClearAllPads = () => {
    setPads(prev => prev.map(p => ({ ...p, isActive: false })));
  };

  const handleLoadRandomVibe = () => {
    initAudio();
    setPads(prev => prev.map(p => ({
      ...p,
      isActive: Math.random() > 0.6
    })));
  };

  // LIVE MICROPHONE VOCAL TOGGLE FLOW
  const handleToggleVocalMicInput = async () => {
    initAudio();
    if (!audioCtxRef.current) return;

    if (isMicActive) {
      // Disconnect stream
      if (micStreamSourceRef.current) {
        micStreamSourceRef.current.disconnect();
        micStreamSourceRef.current = null;
      }
      setIsMicActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        // Pipe into AudioContext routing
        const source = audioCtxRef.current.createMediaStreamSource(stream);
        micStreamSourceRef.current = source;

        if (micGainNodeRef.current) {
          source.connect(micGainNodeRef.current);
        }

        setIsMicActive(true);
      } catch (err: any) {
        console.error("Microphone setup failed", err);
        alert("Couldn't retrieve mic permission. Check your browser or metadata frame authorizations.");
      }
    }
  };

  // Helper to reverse an AudioBuffer when the deckReverse option is active
  const getReversedAudioBuffer = (original: AudioBuffer, reverse: boolean): AudioBuffer => {
    if (!audioCtxRef.current || !original) return original;
    if (!reverse) return original;
    const actx = audioCtxRef.current;
    try {
      const sampleRate = original.sampleRate;
      const length = original.length;
      const numberOfChannels = original.numberOfChannels;
      const reversed = actx.createBuffer(numberOfChannels, length, sampleRate);
      for (let ch = 0; ch < numberOfChannels; ch++) {
        const origData = original.getChannelData(ch);
        const reversedData = reversed.getChannelData(ch);
        for (let i = 0; i < length; i++) {
          reversedData[i] = origData[length - 1 - i];
        }
      }
      return reversed;
    } catch (e) {
      console.error("Error reversing buffer", e);
      return original;
    }
  };

  // Transient detection onset algorithm
  const detectTransients = (buffer: AudioBuffer, count: number): number[] => {
    try {
      const rawData = buffer.getChannelData(0);
      const sampleRate = buffer.sampleRate;
      const frameSize = 1024;
      const numSamples = rawData.length;
      const energies: number[] = [];

      // Analyze energy per frame
      for (let i = 0; i < numSamples; i += frameSize) {
        let sum = 0;
        const end = Math.min(i + frameSize, numSamples);
        for (let j = i; j < end; j++) {
          sum += rawData[j] * rawData[j];
        }
        energies.push(Math.sqrt(sum / frameSize));
      }

      // Flux (change in positive energy)
      const flux: { index: number; val: number }[] = [];
      for (let i = 1; i < energies.length; i++) {
        const diff = Math.max(0, energies[i] - energies[i - 1]);
        flux.push({ index: i, val: diff });
      }

      flux.sort((a, b) => b.val - a.val);

      const positions: number[] = [];
      const frameDuration = frameSize / sampleRate;
      const guardTime = 0.25; // 250ms spacing guard limit

      for (let k = 0; k < flux.length && positions.length < count - 1; k++) {
        const time = flux[k].index * frameDuration;
        if (time > 0.1 && time < buffer.duration - 0.1) {
          if (positions.every(p => Math.abs(p - time) > guardTime)) {
            positions.push(time);
          }
        }
      }

      positions.sort((a, b) => a - b);

      if (positions.length < count - 1) {
        const evenTimes: number[] = [];
        const interval = buffer.duration / count;
        for (let i = 0; i < count; i++) {
          evenTimes.push(i * interval);
        }
        return [...evenTimes, buffer.duration];
      }

      return [0, ...positions, buffer.duration];
    } catch (e) {
      // safe fallback on channel data error
      const evenTimes: number[] = [];
      const interval = buffer.duration / count;
      for (let i = 0; i < count; i++) {
        evenTimes.push(i * interval);
      }
      return [...evenTimes, buffer.duration];
    }
  };

  const recalculateSlices = (buffer: AudioBuffer, sliceCount: number) => {
    const times = detectTransients(buffer, sliceCount);
    const slices: { start: number; end: number; index: number }[] = [];
    for (let i = 0; i < sliceCount; i++) {
      slices.push({
        start: times[i] || 0,
        end: times[i + 1] || buffer.duration,
        index: i
      });
    }
    setSlicesLayout(slices);
  };

  const handlePlaySlice = (idx: number) => {
    initAudio();
    if (!audioCtxRef.current || !originalBeatBufferRef.current || !slicesLayout[idx]) return;
    const actx = audioCtxRef.current;
    const slice = slicesLayout[idx];

    // Stop current play source to avoid overlaps
    if (customBeatSourceNodeRef.current) {
      try {
        customBeatSourceNodeRef.current.stop();
      } catch (_) {}
      customBeatSourceNodeRef.current = null;
    }

    const src = actx.createBufferSource();
    const processedBuffer = getReversedAudioBuffer(originalBeatBufferRef.current, deckReverse);
    src.buffer = processedBuffer;

    const t = actx.currentTime;
    src.playbackRate.setValueAtTime(deckSpeed, t);
    src.detune.setValueAtTime(deckPitch, t);

    if (customBeatLowpassRef.current) {
      src.connect(customBeatLowpassRef.current);
    } else if (customBeatGainNodeRef.current) {
      src.connect(customBeatGainNodeRef.current);
    }

    const duration = Math.max(0.05, slice.end - slice.start);
    try {
      src.start(0, slice.start, duration);
    } catch (e) {
      src.start(0);
    }

    customBeatSourceNodeRef.current = src;
    setIsImportedPlaying(true);
    setActiveSliceIndex(idx);

    // Automatically clear active highlight after duration ends
    setTimeout(() => {
      setActiveSliceIndex(prev => prev === idx ? null : prev);
      setIsImportedPlaying(false);
    }, (duration / deckSpeed) * 1000);
  };

  // MICROPHONE DECK FILE IMPORTER
  const handleImportLocalAudioFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    initAudio();
    if (!audioCtxRef.current) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setImportedBeatFile(file);
    setImportedBeatName(file.name);

    // Decode this audio binary to be playable in layout
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) return;

        audioCtxRef.current?.decodeAudioData(arrayBuffer, (decodedBuffer) => {
          originalBeatBufferRef.current = decodedBuffer;
          customBeatAudioBufferRef.current = decodedBuffer;
          
          // Trigger automatic slicing
          recalculateSlices(decodedBuffer, slicesCount);

          // Prompt successes in Bot Chat instantly
          appendChatMessage(
            "coach",
            `Successfully imported custom backing track: "${file.name}"! I've loaded and prepared the backing deck on your behalf. Playback, transient slicing into ${slicesCount} segments, and real-time effects/pitch manipulation are now active!`
          );
        }, (err) => {
          console.error("Audio decode error", err);
          alert("Could not load beat file. Ensure it is a valid audio format (e.g. mp3/wav).");
        });
      } catch (ex) {
        console.error("File processing failed", ex);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleTogglePlayImportedBeat = () => {
    initAudio();
    if (!audioCtxRef.current || !originalBeatBufferRef.current) {
      alert("No backing track loaded. Upload an MP3/WAV from your device storage or Google Drive.");
      return;
    }

    if (isImportedPlaying) {
      // Stop
      if (customBeatSourceNodeRef.current) {
        try {
          customBeatSourceNodeRef.current.stop();
        } catch (_) {}
        customBeatSourceNodeRef.current = null;
      }
      setIsImportedPlaying(false);
    } else {
      // Play
      const src = audioCtxRef.current.createBufferSource();
      
      // Handle On-the-fly reverse processing of original buffered data
      const processedBuffer = getReversedAudioBuffer(originalBeatBufferRef.current, deckReverse);
      customBeatAudioBufferRef.current = processedBuffer;
      
      src.buffer = processedBuffer;
      src.loop = true;

      // Realtime Pitch, Speed and Filters
      const t = audioCtxRef.current.currentTime;
      src.playbackRate.setValueAtTime(deckSpeed, t);
      src.detune.setValueAtTime(deckPitch, t);

      if (customBeatLowpassRef.current) {
        src.connect(customBeatLowpassRef.current);
      } else if (customBeatGainNodeRef.current) {
        src.connect(customBeatGainNodeRef.current);
      }

      // Compute start / duration offsets based on percentage Trim sliders
      const totalDuration = processedBuffer.duration;
      const startOffsetSec = (deckTrimStart / 100) * totalDuration;
      const endOffsetSec = (deckTrimEnd / 100) * totalDuration;
      const activeDuration = Math.max(0.1, endOffsetSec - startOffsetSec);

      try {
        src.start(0, startOffsetSec);
      } catch (e) {
        src.start(0);
      }
      
      customBeatSourceNodeRef.current = src;
      setIsImportedPlaying(true);
    }
  };

  // SIMULATE DRIVE IMPORTER SELECTOR
  const handleSimulateGoogleDriveSelection = (fileName: string) => {
    setIsDriveOpen(false);
    initAudio();
    
    appendChatMessage(
      "coach",
      `Connecting to Cloud Storage... Let me grab "${fileName}" details on your behalf.`
    );

    // Simulate fetch download stream of waveforms, and inject simple dummy buffer to bypass decode
    setTimeout(() => {
      if (!audioCtxRef.current) return;
      // Synthesize a gorgeous ambient sweep drone on a 2-second buffer
      const sampleRate = audioCtxRef.current.sampleRate;
      const bufferSize = sampleRate * 4; // 4 seconds loops
      const buffer = audioCtxRef.current.createBuffer(2, bufferSize, sampleRate);
      
      // Inject sweet sine wave data to prove playback
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.sin((i * 2 * Math.PI * 180) / sampleRate) * 0.2 * Math.sin((i * Math.PI) / bufferSize);
        }
      }

      originalBeatBufferRef.current = buffer;
      customBeatAudioBufferRef.current = buffer;
      setImportedBeatName(fileName);
      setIsImportedPlaying(false);

      // Trigger automatic slicing
      recalculateSlices(buffer, slicesCount);

      appendChatMessage(
        "coach",
        `🎉 Cloud download complete! "${fileName}" is decoded, sliced into ${slicesCount} transient beats, and loaded inside your backing deck player. Click "Play backing beat" or launch sample slices to tune in!`
      );
    }, 1500);
  };

  // RECORDING ENTIRE MASTER SESSION (BEATS + VOCALS)
  const handleToggleRecordingEntireSession = () => {
    initAudio();
    if (!audioCtxRef.current || !masterDestinationRef.current) return;

    if (isRecordingSession) {
      // STOP recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      setIsRecordingSession(false);
    } else {
      // START recording
      recordedChunksRef.current = [];

      try {
        const stream = masterDestinationRef.current.stream;
        const options = { mimeType: "audio/webm;codecs=opus" };
        const rec = new MediaRecorder(stream, options);
        mediaRecorderRef.current = rec;

        rec.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        rec.onstop = () => {
          const compiledBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
          const generatedUrl = URL.createObjectURL(compiledBlob);

          const newRecording: SavedRecording = {
            id: "rec_" + Date.now(),
            name: `Joules Take #${savedRecordings.length + 1} (${songTitle})`,
            durationMs: recordingSeconds * 1000,
            createdAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            audioUrl: generatedUrl
          };

          const list = [newRecording, ...savedRecordings];
          setSavedRecordings(list);
          localStorage.setItem("joules_studio_recordings", JSON.stringify(list));

          appendChatMessage(
            "coach",
            `🔥 Epic session compiled! Your track "${newRecording.name}" is now saved inside the Library below as a high-quality playable audio wave. You can download or play it back anytime!`
          );
        };

        setRecordingSeconds(0);
        rec.start(250); // get chunks every 250ms

        recordingTimerRef.current = window.setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);

        setIsRecordingSession(true);

        // Turn on metronome loop if not playing
        if (!isGridPlaying) {
          startBeatsScheduler();
        }

        appendChatMessage(
          "coach",
          "🔴 RECORDING ACTIVE! Show me what you've got. Your voice AND beat loops are now fusing directly into our master tape!"
        );
      } catch (err: any) {
        console.error("Recording start failed", err);
        alert("AudioRecording failed. Double check browser mic configuration.");
      }
    }
  };

  // AI MUSIC COACH CHAT API BRIDGE
  const handleQueryAIStudioCoach = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessageText = chatInput;
    setChatInput("");

    // Push message locally
    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const freshHistory = [...chatHistory, userMsg];
    setChatHistory(freshHistory);

    // Call server AI coach
    startChatSending(async () => {
      try {
        const activeLoopNames = pads
          .filter(p => p.isActive)
          .map(p => p.name)
          .join(", ") || "No loops active";

        const response = await fetch("/api/coach-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessageText,
            history: freshHistory,
            currentLyrics: lyricsText,
            bpm: bpm,
            activeStyle: activeLoopNames
          })
        });

        if (response.ok) {
          const result = await response.json();
          appendChatMessage("coach", result.reply);
        } else {
          appendChatMessage("coach", "I felt an electric disruption in the studio. To get the best sound, keep experimenting with our 16-step beat launchers!");
        }
      } catch (err) {
        appendChatMessage("coach", "Lofi offline mode active. Tip: Keep your microphone level high, turn on 'Reverb' for spacey atmosphere, and loop some chill keys.");
      }
    });
  };

  const appendChatMessage = (sender: "user" | "coach", text: string) => {
    setChatHistory(prev => [
      ...prev,
      {
        id: "msg_" + Date.now(),
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // AI LYRICS SONGWRITING SYNTHESIZER
  const handleSynthesizeLyricsUsingAI = () => {
    startLyricsGeneration(async () => {
      try {
        const response = await fetch("/api/generate-lyrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            genre: writingGenre,
            topic: writingTopic,
            tone: writingTone,
            keywords: writingKeywords
          })
        });

        if (response.ok) {
          const data = await response.json();
          setSongTitle(data.title);
          setLyricsText(data.lyricsText);
          if (data.recommendedBpm) {
            setBpm(data.recommendedBpm);
          }
          appendChatMessage(
            "coach",
            `✍️ Synthesized brand new lyrics: "${data.title}" (${writingGenre}) using our advanced songwriting engine. Recommeded speed loaded: ${data.recommendedBpm} BPM! Swing by the "Lyrics Writer" tab to review and practice!`
          );
        } else {
          throw new Error("Lyrics failed");
        }
      } catch (err) {
        appendChatMessage(
          "coach",
          "Songwriter offline. I've placed a soulful, backup set of bars inside your writing deck below to get you rolling!"
        );
      }
    });
  };

  // PROJECT SAVE MANAGER
  const handleSaveCurrentProject = () => {
    if (!newProjectName.trim()) {
      alert("Name your project first before saving!");
      return;
    }

    const activeIds = pads.filter(p => p.isActive).map(p => p.id);
    const newProj: SavedProject = {
      id: "proj_" + Date.now(),
      name: newProjectName,
      bpm,
      lyrics: lyricsText,
      selectedPadIds: activeIds,
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [newProj, ...savedProjects];
    setSavedProjects(updated);
    localStorage.setItem("joules_studio_projects", JSON.stringify(updated));
    setNewProjectName("");
    alert(`Success! Project "${newProj.name}" has been saved onto your local browser storage.`);
  };

  const handleLoadProject = (proj: SavedProject) => {
    setBpm(proj.bpm);
    setLyricsText(proj.lyrics);
    setSongTitle(proj.name);
    
    setPads(prev => prev.map(p => ({
      ...p,
      isActive: proj.selectedPadIds.includes(p.id)
    })));

    appendChatMessage(
      "coach",
      `Loaded project: "${proj.name}" configured with ${proj.bpm} BPM and active sound grid. Start hitting keys and play!`
    );
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedProjects.filter(p => p.id !== id);
    setSavedProjects(filtered);
    localStorage.setItem("joules_studio_projects", JSON.stringify(filtered));
  };

  const handleDeleteRecording = (id: string) => {
    const filtered = savedRecordings.filter(r => r.id !== id);
    setSavedRecordings(filtered);
    localStorage.setItem("joules_studio_recordings", JSON.stringify(filtered));
  };

  // Helper formatting for seconds to digital clock
  const formatSecsDuration = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-purple-500 selection:text-black" id="studio-main">
      
      {/* Background Mesh Orbs */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" id="background-mesh-glow">
        <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[550px] h-[550px] bg-purple-700/15 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[380px] h-[380px] bg-pink-500/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Header bar section */}
      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md px-4 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4" id="navigation-head">
        
        {/* Brand logo details block */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-black shadow-lg shadow-sky-500/20">
            J
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 flex items-center gap-2">
              JOULES MUSIC <span className="text-[9px] px-1.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/20 rounded font-mono uppercase tracking-widest">[BETA STUDIO]</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Professional Web Audio Grooveboard & Vocal Suite</p>
          </div>
        </div>

        {/* Master session playing indicators & metronome display */}
        <div className="flex flex-wrap items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl" id="interactive-deck-master">
          
          {/* Metronome status dot */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-xs font-semibold border border-white/15">
            <span className={`w-2.5 h-2.5 rounded-full transition-all ${isGridPlaying ? (currentStep % 4 === 0 ? "bg-amber-400 scale-125 glow" : "bg-white/40") : "bg-white/15"}`} />
            <span className="font-mono text-white/80">Bar Tempo</span>
          </div>

          {/* Core BPM controller layout */}
          <div className="flex items-center gap-1.5 px-3 py-0.5 bg-white/10 rounded-xl border border-white/15 text-xs font-mono text-white/50">
            <span>BPM</span>
            <button 
              onClick={() => {initAudio(); setBpm(b => Math.max(60, b - 5));}}
              className="w-6 h-6 rounded bg-white/10 text-white font-bold text-center hover:bg-white/20 transition-all cursor-pointer text-xs"
            >-</button>
            <span className="w-10 text-sky-400 text-center font-extrabold text-sm">{bpm}</span>
            <button 
              onClick={() => {initAudio(); setBpm(b => Math.min(220, b + 5));}}
              className="w-6 h-6 rounded bg-white/10 text-white font-bold text-center hover:bg-white/20 transition-all cursor-pointer text-xs"
            >+</button>
          </div>

          {/* Master Launch sequencer button */}
          <button 
            onClick={handleToggleGridSequencePlay}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
              isGridPlaying 
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20" 
                : "bg-gradient-to-r from-sky-400 to-blue-500 text-black hover:opacity-95 shadow-lg shadow-sky-500/10"
            }`}
            id="sequencer-play-btn"
          >
            {isGridPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Beat</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Sound Loops</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Multi-track Workspace Layout console */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 py-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1" id="studio-body-layout">
        
        {/* Left column sidebar for songwriting AI Assistant + Coach */}
        <section className="lg:col-span-5 flex flex-col gap-6" id="coaching-lyrics-workspace">
          
          {/* Navigation Tab Swappers for workspace widgets */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl" id="panel-tab-choices">
            <button
              onClick={() => setActiveTabTab("coach")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "coach" ? "bg-white/15 text-white border border-white/10 shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-sky-400" />
              AI Music Coach
            </button>
            <button
              onClick={() => setActiveTabTab("lyrics")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "lyrics" ? "bg-white/15 text-white border border-white/10 shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4 text-purple-400" />
              Lyrics Scratchpad
            </button>
            <button
              onClick={() => setActiveTabTab("projects")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "projects" ? "bg-white/15 text-white border border-white/10 shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              Saves
            </button>
          </div>

          {/* TAB 1: Joules Music Coach bot */}
          {activeTab === "coach" && (
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-3xl flex flex-col h-[520px] shadow-xl" id="panel-bot-workspace">
              
              {/* Bot status identity badge */}
              <div className="border-b border-white/10 pb-3 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-sky-400">Joules Music intelligence</h3>
                  <p className="text-[10px] text-white/55">Expert advice on BPM setups, songwriting harmonies & loops</p>
                </div>
              </div>

              {/* Chat dialogue display box scroll area */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin" id="dialogue-chat-scroll">
                {chatHistory.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-gradient-to-tr from-sky-400 to-indigo-600 text-black font-semibold rounded-br-none" 
                        : "bg-white/5 border border-white/10 text-white/90 rounded-bl-none"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-white/30 font-mono mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isSendingChat && (
                  <div className="flex items-center gap-2.5 text-white/40 text-xs px-2 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    <span>Joules is analyzing your studio workflow...</span>
                  </div>
                )}
              </div>

              {/* Coaching Quick-Buttons recommendations */}
              <div className="border-t border-white/10 pt-3 space-y-1.5">
                <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold font-mono">Quick consultations:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Give me a hook idea about dreams",
                    "What tempo matches R&B soul?",
                    "How to setup warm vocal mic",
                    "Rhyme ideas for 'Echo' and 'Rain'"
                  ].map((quickText) => (
                    <button
                      key={quickText}
                      onClick={() => {
                        setChatInput(quickText);
                      }}
                      className="text-[10px] py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sky-300 transition-all cursor-pointer text-left"
                    >
                      {quickText}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sending dialog form input section */}
              <form onSubmit={handleQueryAIStudioCoach} className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Joules about structures, rhythms or lofi..."
                  className="flex-1 bg-black/60 rounded-xl p-2.5 text-xs text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-sky-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={isSendingChat || !chatInput.trim()}
                  className="px-4 py-2.5 bg-sky-400 text-black font-extrabold text-xs uppercase rounded-xl hover:bg-sky-300 transition-all cursor-pointer disabled:opacity-40"
                >
                  Ask
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Handcrafted lyrical drafting scratchpad */}
          {activeTab === "lyrics" && (
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-3xl flex flex-col gap-4 min-h-[520px] shadow-xl" id="panel-lyrics-area">
              
              {/* Song title editing header */}
              <div className="flex justify-between items-center gap-2 border-b border-white/10 pb-3">
                <div>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="bg-transparent border-b border-dashed border-white/20 focus:border-sky-400 focus:outline-none text-sm font-bold text-white max-w-[200px]"
                    placeholder="Enter project song title"
                  />
                  <p className="text-[10px] text-white/40 mt-0.5">Edit song name above</p>
                </div>
                <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                  {lyricsText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              {/* Advanced Songwriter Engine prompt form */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  AI Lyric Synthesizer assistant
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-white/50 block">Music Genre</label>
                    <select
                      value={writingGenre}
                      onChange={(e) => setWritingGenre(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 text-xs rounded-lg p-1.5 text-white/90 focus:outline-none"
                    >
                      <option>Chill Lofi Hip-Hop</option>
                      <option>High Energy Trap Beat</option>
                      <option>Melodic Pop/Soul</option>
                      <option>Deep Vulnerable R&B</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] text-white/50 block">Lyric Mood Tone</label>
                    <select
                      value={writingTone}
                      onChange={(e) => setWritingTone(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 text-xs rounded-lg p-1.5 text-white/90 focus:outline-none"
                    >
                      <option>Uplifting</option>
                      <option>Deeply Emotional</option>
                      <option>Aggressive & Proud</option>
                      <option>Chill & Introspective</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-white/50 block">Main Theme/Topic</label>
                    <input
                      type="text"
                      value={writingTopic}
                      onChange={(e) => setWritingTopic(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 text-xs rounded-lg p-1.5 text-white"
                      placeholder="e.g. Broken hearts, new dawn"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] text-white/50 block">Slang words / Keywords</label>
                    <input
                      type="text"
                      value={writingKeywords}
                      onChange={(e) => setWritingKeywords(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 text-xs rounded-lg p-1.5 text-white"
                      placeholder="e.g. echo, rain, gold"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSynthesizeLyricsUsingAI}
                  disabled={isGeneratingLyrics}
                  className="w-full py-1.5 rounded-lg bg-purple-500 text-black font-extrabold text-[10px] uppercase tracking-widest hover:bg-purple-400 transition-all disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isGeneratingLyrics ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing structured verses...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Generate Lyrics Draft</span>
                    </>
                  )}
                </button>
              </div>

              {/* Lyrical editing textarea */}
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  value={lyricsText}
                  onChange={(e) => setLyricsText(e.target.value)}
                  className="w-full flex-1 bg-black/60 p-3 rounded-xl border border-white/10 text-xs text-white font-sans placeholder-white/20 focus:outline-none focus:border-purple-500 transition-all resize-none leading-relaxed"
                  rows={14}
                  placeholder="Draft your verses here... Write down [CHORUS] or [VERSE 1] to split down parts. Hit auto-generate above to get creative flows instantly!"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Projects management saver list */}
          {activeTab === "projects" && (
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-3xl min-h-[520px] flex flex-col justify-between shadow-xl" id="panel-saves-work">
              
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-amber-400">Saved Projects list</h3>
                    <p className="text-[10px] text-white/55">Export layout and text onto browser storage</p>
                  </div>
                </div>

                {/* Name new project fields card */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2.5">
                  <label className="text-[10px] text-white/60 block font-bold font-mono">Store current workspace layout:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="e.g. Lofi Dream v1"
                      className="bg-black/60 border border-white/10 text-xs rounded-lg p-2 flex-1 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={handleSaveCurrentProject}
                      className="p-2 bg-amber-400 hover:bg-amber-500 text-black rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold uppercase"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </div>

                {/* Lists projects */}
                <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
                  {savedProjects.length > 0 ? (
                    savedProjects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => handleLoadProject(proj)}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-all">{proj.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[9px] text-white/50 font-mono">
                            <span>{proj.bpm} BPM</span>
                            <span>•</span>
                            <span>{proj.selectedPadIds.length} loops</span>
                            <span>•</span>
                            <span>{proj.createdAt}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => handleDeleteProject(proj.id, e)}
                          className="p-1 px-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-black rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-white/40 text-xs">
                      No saved tracks found. Create layouts on the board and export them!
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed font-sans mt-3">
                <Info className="w-4 h-4 text-amber-400 shrink-0 inline-block mr-1.5 mb-1" />
                <span>Projects are retained locally. They lock your sound pads activation grid, current scratchpad text, songwriting tempo and metadata details.</span>
              </div>
            </div>
          )}

        </section>

        {/* Center column display: sound board, active sequencer lights, recording studio vocal desk */}
        <section className="lg:col-span-7 flex flex-col gap-6" id="loop-pads-audio-suite">
          
          {/* Groovepad sound grid launchpad widget */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-3xl space-y-4 shadow-xl" id="soundboard-launcher">
            
            <div className="flex justify-between items-center bg-black/20 p-2 rounded-xl">
              <div>
                <h2 className="text-xs font-black uppercase text-sky-400 tracking-[0.2em] flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-sky-400 fill-current animate-pulse" />
                  Groovepad Sound Launchpad
                </h2>
                <p className="text-[10px] text-white/55 mt-0.5">Toggle sound loops in real sync. They play beautifully to BPM!</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLoadRandomVibe}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] uppercase font-bold tracking-widest transition-all cursor-pointer border border-white/10"
                >
                  Surprise Block
                </button>
                <button
                  onClick={handleClearAllPads}
                  className="px-2.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/20 text-rose-300 rounded-lg text-[9px] uppercase font-bold tracking-widest transition-all cursor-pointer border border-rose-500/20"
                >
                  Clear Beat
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-black/40 rounded-xl border border-white/5" id="launchpad-filter-tabs">
              {["All", "Beats", "Bass", "Melody", "Synth", "Vocal FX"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 min-w-[75px] text-center py-1.5 px-2 rounded-lg text-[9px] uppercase font-mono font-bold tracking-wider transition-all cursor-pointer border ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white border-sky-400/30 shadow-lg shadow-sky-500/10"
                      : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Groovepad style Grid of toggle Soundblock buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" id="launchpad-grid-elements">
              {pads
                .filter((pad) => selectedCategory === "All" || pad.category === selectedCategory)
                .map((pad) => {
                  const isPadPlayingThisBeatStep = isGridPlaying && pad.isActive && pad.rhythmPattern[currentStep] === 1;

                return (
                  <button
                    key={pad.id}
                    onClick={() => handleTogglePad(pad.id)}
                    className={`p-3.5 rounded-xl border relative text-left h-[80px] flex flex-col justify-between transition-all cursor-pointer select-none overflow-hidden ${
                      pad.isActive 
                        ? `bg-gradient-to-tr ${CATEGORIES_COLOR[pad.color]} border-white text-black shadow-lg` 
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    } ${isPadPlayingThisBeatStep ? "animate-beat-pulse border-sky-300 scale-[1.03]" : ""}`}
                  >
                    {/* Blinking wave light indicator on beat step rhythm matches */}
                    {isPadPlayingThisBeatStep && (
                      <div className="absolute inset-0 bg-white/30 animate-ping pointer-events-none"></div>
                    )}
                    
                    {/* Top Pad info badge */}
                    <div className="flex justify-between items-start w-full">
                      <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        pad.isActive ? "bg-black/20 text-black" : "bg-white/10 text-white/60"
                      }`}>
                        {pad.category}
                      </span>
                      {pad.isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      )}
                    </div>

                    {/* Pad Title */}
                    <div>
                      <p className="text-xs font-bold leading-tight tracking-tight line-clamp-2">{pad.name}</p>
                      <p className={`text-[8px] mt-0.5 font-mono uppercase tracking-widest ${
                        pad.isActive ? "text-black/60" : "text-white/40"
                      }`}>
                        {pad.waveType} • {pad.baseFreq}Hz
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 16-Step Live visual display bars synchronicity lights */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[9px] font-mono uppercase text-white/40">
                <span>Rhythmic Loop Quantizer ticks:</span>
                <span>Active Step: {currentStep + 1} / 16</span>
              </div>
              
              <div className="grid gap-1 px-1" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
                {Array.from({ length: 16 }).map((_, stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`h-2.5 rounded-sm transition-all duration-100 ${
                      currentStep === stepIdx && isGridPlaying
                        ? "bg-gradient-to-t from-sky-400 to-indigo-500 scale-y-125 glow shadow-cyber"
                        : stepIdx % 4 === 0
                        ? "bg-white/20"
                        : "bg-white/5"
                    }`}
                    title={`Tick step ${stepIdx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Sound recording microphone & vocal studio effects module */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-3xl space-y-4 shadow-xl" id="vocal-mic-desk">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${isMicActive ? "bg-emerald-500/20 text-emerald-300 animate-pulse" : "bg-white/5 text-white/50"}`}>
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Vocal Recording & optimizations</h3>
                  <p className="text-[10px] text-white/55">Real microphone pipeline with studio enhancement filter suite</p>
                </div>
              </div>

              {/* MIC TOGGLE BUTTON */}
              <button
                onClick={handleToggleVocalMicInput}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all flex items-center gap-2 ${
                  isMicActive
                    ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/15"
                    : "bg-white/10 hover:bg-white/15 border border-white/15 text-white"
                }`}
              >
                {isMicActive ? (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Microphone: ON</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-4 h-4 text-white/40" />
                    <span>Connect Mic</span>
                  </>
                )}
              </button>
            </div>

            {/* Vocal Studio custom FX controllers layout */}
            <div className="space-y-4">
              
              {/* Section: Reverb & Delay Sends */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 p-4 rounded-xl border border-white/5 text-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-white/80">
                    <span className="flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-purple-400" />
                      Cathedral Reverb mix
                    </span>
                    <span className="font-mono text-purple-400">{reverbMix}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reverbMix}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setReverbMix(val);
                      if (reverbGainRef.current) {
                        reverbGainRef.current.gain.setValueAtTime(val / 100, audioCtxRef.current?.currentTime || 0);
                      }
                    }}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <p className="text-[9px] text-white/40">Gives vocal take space, resonance, and stadium depths instantly.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-white/80">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-sky-400" />
                      Glacier Feedback Delay
                    </span>
                    <span className="font-mono text-sky-400">{delayFeedback}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={delayFeedback}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDelayFeedback(val);
                      if (delayGainRef.current) {
                        delayGainRef.current.gain.setValueAtTime((val / 100) * 0.7, audioCtxRef.current?.currentTime || 0);
                      }
                    }}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                  <p className="text-[9px] text-white/40">Triggers syncopated echo bounces for that premium polished hip-hop vibe.</p>
                </div>
              </div>

              {/* Advanced Real-time Pitch Correction (Auto-Tune) */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="flex items-center gap-1.5 font-bold text-sky-400 uppercase tracking-wider text-[10px]">
                    <Music className="w-3.5 h-3.5" />
                    Adaptive pitch Auto-Tune Engine
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={vocalAutoTuneActive} 
                      onChange={(e) => {
                        initAudio();
                        setVocalAutoTuneActive(e.target.checked);
                      }} 
                    />
                    <div className="w-7 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-sky-400"></div>
                  </label>
                </div>

                {vocalAutoTuneActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 transition-all">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-white/50 block font-semibold">Scale Mode</span>
                      <select 
                        value={vocalAutoTuneScale}
                        onChange={(e) => setVocalAutoTuneScale(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="Major" className="bg-neutral-900">Major Scale</option>
                        <option value="Minor" className="bg-neutral-900">Natural Minor</option>
                        <option value="Pentatonic" className="bg-neutral-900">Pentatonic</option>
                        <option value="Chromatic" className="bg-neutral-900">Chromatic</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-white/50 block font-semibold">Root Key</span>
                      <select 
                        value={vocalAutoTuneKey}
                        onChange={(e) => setVocalAutoTuneKey(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map(k => (
                          <option key={k} value={k} className="bg-neutral-900">{k}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-white/50 font-semibold">
                        <span>Retune Speed</span>
                        <span className="text-sky-300">{vocalAutoTuneSpeed}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={vocalAutoTuneSpeed}
                        onChange={(e) => setVocalAutoTuneSpeed(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400 mt-2"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[9px] text-white/40">Snaps vocals instantly to the chosen scale. High retune speed delivers a modern robotic auto-tune vibe.</p>
              </div>

              {/* Section: Noise Gate / De-Noiser */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                    <VolumeX className="w-3.5 h-3.5" />
                    Intelligent Noise Gate / Denoising
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={vocalNoiseGateActive} 
                      onChange={(e) => {
                        initAudio();
                        setVocalNoiseGateActive(e.target.checked);
                      }} 
                    />
                    <div className="w-7 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-400"></div>
                  </label>
                </div>

                {vocalNoiseGateActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 transition-all">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/50 font-semibold">
                        <span>dB Noise Floor Threshold</span>
                        <span className="text-emerald-300">{vocalNoiseGateThreshold} dB</span>
                      </div>
                      <input 
                        type="range"
                        min="-70"
                        max="-25"
                        value={vocalNoiseGateThreshold}
                        onChange={(e) => setVocalNoiseGateThreshold(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/50 font-semibold">
                        <span>Suppression Reduction</span>
                        <span className="text-emerald-300">{vocalNoiseGateReduction} dB</span>
                      </div>
                      <input 
                        type="range"
                        min="-60"
                        max="-10"
                        value={vocalNoiseGateReduction}
                        onChange={(e) => setVocalNoiseGateReduction(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[9px] text-white/40">Suppresses background room noise and fan hums while leaving quiet vocal tails fully intact.</p>
              </div>

              {/* Section: Clarity EQ filters */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Parametric Clarity filters (EQ)
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={vocalClarityActive} 
                      onChange={(e) => {
                        initAudio();
                        setVocalClarityActive(e.target.checked);
                      }} 
                    />
                    <div className="w-7 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-400"></div>
                  </label>
                </div>

                {vocalClarityActive && (
                  <div className="space-y-3 pt-1 transition-all">
                    <div className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded text-[11px] text-white/80">
                      <span>Low-cut Mud Filter (Passes high-pass at 80Hz)</span>
                      <input 
                        type="checkbox"
                        checked={vocalClarityLowCut}
                        onChange={(e) => setVocalClarityLowCut(e.target.checked)}
                        className="w-3.5 h-3.5 rounded accent-amber-400"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-[10px] text-white/50 font-semibold">
                        <span>High-Shelf Boost for "Air" (10kHz)</span>
                        <span className="text-amber-300">+{vocalClarityAirShelf} dB</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="12"
                        value={vocalClarityAirShelf}
                        onChange={(e) => setVocalClarityAirShelf(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[9px] text-white/40">Slashes muddy console room rumble at 80Hz and lifts crisp "air" presence frequencies at 10kHz.</p>
              </div>

              {/* Section: Vocal Layering */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="flex items-center gap-1.5 font-bold text-purple-400 uppercase tracking-wider text-[10px]">
                    <Layers className="w-3.5 h-3.5" />
                    Double Vocal Layering & Width
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={vocalLayeringActive} 
                      onChange={(e) => {
                        initAudio();
                        setVocalLayeringActive(e.target.checked);
                      }} 
                    />
                    <div className="w-7 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-400"></div>
                  </label>
                </div>

                {vocalLayeringActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 transition-all">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/50 font-semibold">
                        <span>Micro-Delay Offset</span>
                        <span className="text-purple-300">{vocalLayeringDelay} ms</span>
                      </div>
                      <input 
                        type="range"
                        min="15"
                        max="30"
                        value={vocalLayeringDelay}
                        onChange={(e) => setVocalLayeringDelay(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/50 font-semibold">
                        <span>LFO Chorus Detune</span>
                        <span className="text-purple-300">{vocalLayeringDetune} cents</span>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="25"
                        value={vocalLayeringDetune}
                        onChange={(e) => setVocalLayeringDetune(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[9px] text-white/40">Multiplies your recordings with a secondary delayed, detuned vocal chorus track to formulate incredible sonic width.</p>
              </div>

            </div>

            {/* Optimized dynamic compressor status panel */}
            <div className="flex items-center gap-3 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <div className="flex-1">
                <p className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Viper Vocal Compressor: AUTOMATIC</p>
                <p className="text-[10px] text-white/60 leading-normal">Optimizes vocal warmth by filtering low-end mud, enhancing vocal mids, and preventing harsh clipping spikes.</p>
              </div>
            </div>

            {/* Vocal waves frequency analyser animation peaks */}
            <div className="bg-black/60 p-3 rounded-xl border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] text-white/40 font-mono">
                <span>Vocal frequency monitor:</span>
                <span>{isMicActive ? "Live input feed tracking" : "Microphone idle"}</span>
              </div>
              <div className="flex items-end justify-between gap-1 h-14 px-2" id="live-mic-visualizer">
                {visualDataArr.map((v, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${v}%` }}
                    className={`w-full rounded-t transition-all duration-75 ${
                      isMicActive
                        ? "bg-gradient-to-t from-emerald-500 via-sky-400 to-indigo-500 justify-self-center animate-pulse"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Master Deck and Tape Recording interface, with custom imports */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-3xl space-y-5 shadow-xl" id="master-rec-core">
            
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xs font-black uppercase text-amber-400 tracking-[0.2em] flex items-center gap-1.5">
                <Disc className="w-4 h-4 text-amber-500" />
                TAPES MASTER & PLAYBACK DECK
              </h3>
              <p className="text-[10px] text-white/55 mt-0.5">Mix and compile everything into high-performance audio takes</p>
            </div>

            {/* Sound Import / Device back beat triggers section */}
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <p className="text-[11px] font-bold text-white/80">Backing beat importer</p>
                {importedBeatName ? (
                  <div className="flex items-center gap-1.5 text-xs text-sky-400 font-bold">
                    <Music4 className="w-4 h-4 text-sky-400" />
                    <span>Loaded: {importedBeatName}</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-white/50">Pick custom instrumental files from your device or Google Drive</p>
                )}
              </div>

              {/* Upload file triggers button with drive popup triggers */}
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <label className="px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-[10px] uppercase tracking-wider font-extrabold rounded-lg cursor-pointer transition-all flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-sky-300" />
                  <span>Local Beat</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleImportLocalAudioFile}
                    className="hidden"
                  />
                </label>

                {/* Google Drive triggering popup button */}
                <button
                  onClick={() => setIsDriveOpen(true)}
                  className="px-3 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 text-[10px] uppercase tracking-wider font-extrabold rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Google Drive</span>
                </button>
              </div>
            </div>

            {/* Imported audio player track bar if loaded */}
            {importedBeatName && (
              <div className="p-4 bg-black/60 rounded-xl border border-white/10 flex flex-col gap-4 text-xs">
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause individual loaded track beat */}
                    <button
                      onClick={handleTogglePlayImportedBeat}
                      className="px-4 py-2 bg-sky-400 text-black font-extrabold uppercase text-[10px] tracking-wider rounded-lg hover:bg-sky-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-sky-400/20"
                    >
                      {isImportedPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Stop Backing Track</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play backing beat</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      Status: {isImportedPlaying ? "🟢 LOOPING" : "🔴 STOPPED"}
                    </span>
                  </div>

                  {/* Mixing volume slider */}
                  <div className="flex items-center gap-2 w-full md:max-w-[240px]">
                    <Volume2 className="w-4 h-4 text-white/50" />
                    <span className="text-[10px] font-mono text-white/40 w-[30px]">Vol</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={importedBeatVolume}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setImportedBeatVolume(val);
                        if (customBeatGainNodeRef.current) {
                          customBeatGainNodeRef.current.gain.setValueAtTime(val / 100, audioCtxRef.current?.currentTime || 0);
                        }
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                    <span className="font-mono text-[9px] text-white/60 w-[30px] text-right">{importedBeatVolume}%</span>
                  </div>
                </div>

                {/* Backing Track advanced manipulation sliders deck */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs bg-white/5 p-4 rounded-xl border border-white/5">
                  
                  {/* SPEED & PLAYBACK RATE CONTROL */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                      <span>⚡ SPEED / TEMPO</span>
                      <span className="text-sky-300 font-bold font-mono">{deckSpeed.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={deckSpeed}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDeckSpeed(val);
                        if (customBeatSourceNodeRef.current && audioCtxRef.current) {
                          customBeatSourceNodeRef.current.playbackRate.setValueAtTime(val, audioCtxRef.current.currentTime);
                        }
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-300"
                    />
                    <div className="flex justify-between text-[8px] text-white/30 font-mono">
                      <span>0.5x</span>
                      <button onClick={() => {
                        setDeckSpeed(1.0);
                        if (customBeatSourceNodeRef.current && audioCtxRef.current) {
                          customBeatSourceNodeRef.current.playbackRate.setValueAtTime(1.0, audioCtxRef.current.currentTime);
                        }
                      }} className="hover:text-sky-300 transition-colors">RESET to 1.0x</button>
                      <span>2.0x</span>
                    </div>
                  </div>

                  {/* FINE PITCH / DETUNE CONTROL */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                      <span>🎵 FINE PITCH (CENTS)</span>
                      <span className="text-emerald-400 font-bold font-mono">{deckPitch > 0 ? `+${deckPitch}` : deckPitch}¢</span>
                    </div>
                    <input
                      type="range"
                      min="-1200"
                      max="1200"
                      step="50"
                      value={deckPitch}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDeckPitch(val);
                        if (customBeatSourceNodeRef.current && audioCtxRef.current) {
                          customBeatSourceNodeRef.current.detune.setValueAtTime(val, audioCtxRef.current.currentTime);
                        }
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                    <div className="flex justify-between text-[8px] text-white/30 font-mono">
                      <span>-1 Octave</span>
                      <button onClick={() => {
                        setDeckPitch(0);
                        if (customBeatSourceNodeRef.current && audioCtxRef.current) {
                          customBeatSourceNodeRef.current.detune.setValueAtTime(0, audioCtxRef.current.currentTime);
                        }
                      }} className="hover:text-emerald-400 transition-colors">RESET to 0</button>
                      <span>+1 Octave</span>
                    </div>
                  </div>

                  {/* REVERSE DECK TOGGLE */}
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-white uppercase font-mono">REVERSE TAPE</p>
                      <p className="text-[8px] text-white/40">Inverts the audio loop samples</p>
                    </div>
                    <button
                      onClick={() => {
                        const nextReverse = !deckReverse;
                        setDeckReverse(nextReverse);
                        // If it is playing right now, restart playback smoothly with the reversed version!
                        if (isImportedPlaying) {
                          handleTogglePlayImportedBeat(); // turn off
                          setTimeout(() => {
                            handleTogglePlayImportedBeat(); // turn on with updated state
                          }, 100);
                        }
                      }}
                      className={`px-3 py-1.5 text-[9px] uppercase tracking-widest rounded-md font-mono font-black transition-all cursor-pointer border ${
                        deckReverse 
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse" 
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {deckReverse ? "REVERSED ON" : "NORMAL"}
                    </button>
                  </div>

                  {/* LOWPASS FILTER SLIDER */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                      <span>🔆 LOWPASS FILTER (MUFFLE)</span>
                      <span className="text-amber-400 font-bold font-mono">
                        {deckLowpass === 20000 ? "Bypass" : `${deckLowpass} Hz`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="20000"
                      step="100"
                      value={deckLowpass}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDeckLowpass(val);
                        if (customBeatLowpassRef.current && audioCtxRef.current) {
                          customBeatLowpassRef.current.frequency.setValueAtTime(val, audioCtxRef.current.currentTime);
                        }
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <div className="flex justify-between text-[8px] text-white/30 font-mono">
                      <span>100Hz</span>
                      <button onClick={() => {
                        setDeckLowpass(20000);
                        if (customBeatLowpassRef.current && audioCtxRef.current) {
                          customBeatLowpassRef.current.frequency.setValueAtTime(20000, audioCtxRef.current.currentTime);
                        }
                      }} className="hover:text-amber-400 transition-colors">BYPASS (20kHz)</button>
                      <span>20kHz</span>
                    </div>
                  </div>

                  {/* HIGHPASS FILTER SLIDER */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                      <span>⚡ HIGHPASS FILTER (TINNY)</span>
                      <span className="text-purple-400 font-bold font-mono">
                        {deckHighpass === 20 ? "Bypass" : `${deckHighpass} Hz`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="12000"
                      step="50"
                      value={deckHighpass}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDeckHighpass(val);
                        if (customBeatHighpassRef.current && audioCtxRef.current) {
                          customBeatHighpassRef.current.frequency.setValueAtTime(val, audioCtxRef.current.currentTime);
                        }
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                    <div className="flex justify-between text-[8px] text-white/30 font-mono">
                      <span>Bypass (20Hz)</span>
                      <button onClick={() => {
                        setDeckHighpass(20);
                        if (customBeatHighpassRef.current && audioCtxRef.current) {
                          customBeatHighpassRef.current.frequency.setValueAtTime(20, audioCtxRef.current.currentTime);
                        }
                      }} className="hover:text-purple-400 transition-colors">BYPASS</button>
                      <span>12kHz</span>
                    </div>
                  </div>

                  {/* BASS BOOST EQUALIZER CONTROL */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                      <span>🔊 BASS BOOST (100Hz)</span>
                      <span className="text-rose-400 font-bold font-mono">{deckBassBoost > 0 ? `+${deckBassBoost}` : deckBassBoost} dB</span>
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      value={deckBassBoost}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDeckBassBoost(val);
                        if (customBeatBassBoostRef.current && audioCtxRef.current) {
                          customBeatBassBoostRef.current.gain.setValueAtTime(val, audioCtxRef.current.currentTime);
                        }
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-[8px] text-white/30 font-mono">
                      <span>-12dB</span>
                      <button onClick={() => {
                        setDeckBassBoost(0);
                        if (customBeatBassBoostRef.current && audioCtxRef.current) {
                          customBeatBassBoostRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
                        }
                      }} className="hover:text-pink-500 transition-colors">RESET to 0</button>
                      <span>+12dB</span>
                    </div>
                  </div>

                  {/* WAVEFORM TRIM RANGE START (PERCENTAGE) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                      <span>✂️ WAVE TRIM START</span>
                      <span className="text-[#38bdf8] font-bold font-mono">{deckTrimStart}% of track</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={deckTrimStart}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDeckTrimStart(val);
                        if (isImportedPlaying) {
                          // Quick restart to apply trim bounds
                          handleTogglePlayImportedBeat();
                          setTimeout(() => {
                            handleTogglePlayImportedBeat();
                          }, 100);
                        }
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                  </div>

                  {/* WAVEFORM TRIM RANGE END (PERCENTAGE) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                      <span>✂️ WAVE TRIM END</span>
                      <span className="text-[#f43f5e] font-bold font-mono">{deckTrimEnd}% of track</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={deckTrimEnd}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDeckTrimEnd(val);
                        if (isImportedPlaying) {
                          // Quick restart to apply trim bounds
                          handleTogglePlayImportedBeat();
                          setTimeout(() => {
                            handleTogglePlayImportedBeat();
                          }, 100);
                        }
                      }}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  {/* ACTIVE BEAT PARAMETERS RESET HEADER */}
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-white uppercase font-mono">FULL DECK RESET</p>
                      <p className="text-[8px] text-white/40">Restore original speed/pitch/filters</p>
                    </div>
                    <button
                      onClick={() => {
                        setDeckSpeed(1.0);
                        setDeckPitch(0);
                        setDeckLowpass(20000);
                        setDeckHighpass(20);
                        setDeckBassBoost(0);
                        setDeckTrimStart(0);
                        setDeckTrimEnd(100);
                        setDeckReverse(false);
                        if (isImportedPlaying) {
                          handleTogglePlayImportedBeat();
                          setTimeout(() => {
                            handleTogglePlayImportedBeat();
                          }, 100);
                        }
                      }}
                      className="px-2.5 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-md text-[9px] text-[#38bdf8] font-extrabold uppercase tracking-wide cursor-pointer text-center"
                    >
                      Reset Deck
                    </button>
                  </div>

                </div>

                {/* Advanced Transient Slicing & Auto Tempo Sync Board */}
                <div className="border-t border-white/10 pt-4 space-y-4">
                  
                  {/* Tempo Synchronization & original BPM selector */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase text-sky-400 tracking-wider flex items-center gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${bpmSyncActive ? "animate-spin" : ""}`} />
                        Phase-Locked BPM Synchronization
                      </h4>
                      <p className="text-[9px] text-white/50 leading-relaxed">Runs phase vocoder calculations to lock sample timing to match session BPM without affecting musical pitch.</p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/10 px-2 py-1 rounded">
                        <span className="text-[9px] text-white/40 font-mono">Original Beat BPM:</span>
                        <input 
                          type="number"
                          min="45"
                          max="240"
                          value={backingTrackOriginalBPM}
                          onChange={(e) => setBackingTrackOriginalBPM(Number(e.target.value))}
                          className="w-12 bg-transparent text-xs text-sky-400 font-bold focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={() => {
                          initAudio();
                          setBpmSyncActive(!bpmSyncActive);
                        }}
                        className={`px-3 py-1.5 text-[10px] uppercase font-black tracking-widest rounded-lg border cursor-pointer transition-all ${
                          bpmSyncActive
                            ? "bg-sky-500 text-black border-sky-400 shadow-md shadow-sky-500/10"
                            : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {bpmSyncActive ? "BPM LOCKED" : "SYNC TEMPO"}
                      </button>
                    </div>
                  </div>

                  {/* Slicing Controls & Slice Triggers Launchpad */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-2">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          Transient Groove Slice Launchpad
                        </h4>
                        <p className="text-[9px] text-white/40">Transient analysis slices uploaded audio dynamically at drum triggers.</p>
                      </div>

                      <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 px-2.5 py-1 rounded">
                        <span className="text-[9px] text-white/50 font-mono">Slices:</span>
                        <select
                          value={slicesCount}
                          onChange={(e) => {
                            const sc = Number(e.target.value) as 4 | 8 | 16;
                            setSlicesCount(sc);
                            if (originalBeatBufferRef.current) {
                              recalculateSlices(originalBeatBufferRef.current, sc);
                            }
                          }}
                          className="bg-transparent text-[11px] text-purple-300 font-bold focus:outline-none"
                        >
                          <option value={4} className="bg-neutral-900">4 divisions</option>
                          <option value={8} className="bg-neutral-900">8 divisions</option>
                          <option value={16} className="bg-neutral-900">16 divisions</option>
                        </select>
                      </div>
                    </div>

                    {slicesLayout.length > 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2">
                        {slicesLayout.map((slice, sIdx) => {
                          const isActive = activeSliceIndex === sIdx;
                          return (
                            <button
                              key={sIdx}
                              onClick={() => handlePlaySlice(sIdx)}
                              className={`py-3.5 px-2 rounded-lg border uppercase font-mono text-[9px] font-black cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                                isActive
                                  ? "bg-purple-500 text-black border-purple-300 shadow-lg shadow-purple-500/25 scale-[1.03] animate-pulse"
                                  : "bg-white/5 border-white/10 text-white/55 hover:bg-white/10 hover:border-purple-500/30 hover:text-white"
                              }`}
                            >
                              <span className="text-[8px] opacity-40">#{sIdx + 1}</span>
                              <span className="font-bold">{slice.start.toFixed(2)}s</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] text-white/40 italic text-center py-2">Loading performance triggers...</p>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* MAIN SESSION RECORDER ACTIVATE TRIGGERS */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4" id="main-performance-mic-record-hud">
              
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/25 px-2 py-0.5 rounded uppercase font-bold font-mono tracking-widest leading-none block w-max mx-auto sm:mx-0">
                  Master tape room
                </span>
                <p className="text-sm font-bold text-white mt-1.5">Record entire custom studio performance</p>
                <p className="text-[10px] text-white/50">Includes active synth block loops, custom back tracks, and your microphone vocals!</p>
              </div>

              <div className="flex items-center gap-3">
                
                {/* Visual recording timer clock */}
                {isRecordingSession && (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 rounded-xl text-xs font-mono font-bold text-rose-400 animation-pulse border border-rose-500/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                    <span>REC {formatSecsDuration(recordingSeconds)}</span>
                  </div>
                )}

                <button
                  onClick={handleToggleRecordingEntireSession}
                  className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all flex items-center gap-2 ${
                    isRecordingSession
                      ? "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/30"
                      : "bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:opacity-95 shadow-lg shadow-amber-400/20"
                  }`}
                  id="record-master-btn"
                >
                  {isRecordingSession ? (
                    <>
                      <Pause className="w-4 h-4 text-white fill-current" />
                      <span>Compile Tape</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-black" />
                      <span>Record Full take</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* COMPILED EXPORT TAKES LIBRARY FOR DOWNLOAD OR PLAYBACK */}
            <div className="space-y-3 pt-2" id="takes-library">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-white/50 font-mono">Compiled Recording Takes Library:</h4>
              
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {savedRecordings.length > 0 ? (
                  savedRecordings.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-white flex items-center gap-1">
                          <Music className="w-3.5 h-3.5 text-amber-400" />
                          {rec.name}
                        </p>
                        <div className="flex items-center gap-3 font-mono text-[9px] text-white/40">
                          <span>Length: {formatSecsDuration(Math.floor(rec.durationMs / 1000))}</span>
                          <span>•</span>
                          <span>{rec.createdAt}</span>
                        </div>
                      </div>

                      {/* Controls to play compiled web stream take or download file instantly */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {rec.audioUrl && (
                          <>
                            <audio 
                              controls 
                              src={rec.audioUrl} 
                              className="h-7 w-[200px] bg-transparent outline-none scale-90"
                            />
                            
                            <a
                              href={rec.audioUrl}
                              download={`${rec.name.replace(/\s+/g, "_")}.webm`}
                              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
                              title="Download Master Track Audio File"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </>
                        )}

                        <button
                          onClick={() => handleDeleteRecording(rec.id)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 rounded-lg transition-all cursor-pointer"
                          title="Delete tape"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-white/40 text-xs">
                    No custom tapes cut yet. Hit "Record Full take" above, sing or play loops, and complete compile to load playable results!
                  </div>
                )}
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* Simulated Google Drive Picker Dialog UI Modal popup */}
      {isDriveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" id="dialog-gdrive">
          <div className="w-full max-w-md bg-[#0f0f13] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm tracking-wide text-white uppercase font-sans">Browse files on Cloud Google Drive</h3>
              </div>
              <button 
                onClick={() => setIsDriveOpen(false)}
                className="p-1 text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Cloud Files */}
            <div className="p-4 space-y-2 flex-1 overflow-y-auto max-h-[300px]">
              <p className="text-[10px] uppercase text-white/40 tracking-wider font-bold mb-2">Backing loops found in Cloud directory:</p>
              
              {driveFiles.map((df) => (
                <div
                  key={df.name}
                  onClick={() => handleSimulateGoogleDriveSelection(df.name)}
                  className="p-3 bg-white/5 hover:bg-sky-500/10 hover:border-sky-500/35 border border-white/5 rounded-xl transition-all cursor-pointer block text-left"
                >
                  <p className="text-xs font-bold text-white">{df.name}</p>
                  <div className="flex justify-between items-center mt-1 text-[9px] text-white/40 font-mono">
                    <span>Duration: {df.duration}</span>
                    <span>{df.size}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer notice info */}
            <div className="p-4 border-t border-white/10 bg-black/20 text-[10px] text-white/50 flex items-start gap-1.5 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 select-none mt-0.5" />
              <span>We connect to public Google API storage buckets. Selecting a file fetches it dynamically to your local browser decoders instantly.</span>
            </div>

          </div>
        </div>
      )}

      {/* Modern minimal micro footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md py-8 px-4 text-center space-y-3 mt-12" id="studio-foot">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-mono">
          JOULES MUSIC TAPE STUDIO © {new Date().getFullYear()}. DESIGNED UNDER THE CHROMATIC CARBON GLASS LAYOUT GUIDELINES.
        </p>
        <p className="text-[11px] text-white/35 max-w-xl mx-auto leading-relaxed">
          The synthesized metronomes are generated completely natively inside the client using Web Audio API nodes. Mix of instruments occur in real-time on our professional multi-channel gain network.
        </p>
      </footer>
    </div>
  );
}
