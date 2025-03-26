import { WebMidi } from "webmidi";

class MidiManager {
  private static instance: MidiManager;
  public isMidiSupported: boolean = false;
  public midiInputs: any[] = [];

  private constructor() {
    this.initialize();
  }

  public static getInstance(): MidiManager {
    if (!MidiManager.instance) {
      MidiManager.instance = new MidiManager();
    }
    return MidiManager.instance;
  }

  private initialize() {
    if (navigator.requestMIDIAccess) {
      WebMidi.enable((err) => {
        if (err) {
          console.error("WebMidi could not be enabled.", err);
          this.isMidiSupported = false;
        } else {
          console.log("WebMidi enabled");
          this.isMidiSupported = true;
          this.midiInputs = WebMidi.inputs;
        }
      });
    } else {
      console.error("Web MIDI API is not supported in this browser.");
      this.isMidiSupported = false;
    }
  }

  // Optionally, add helper methods to add or remove listeners.
  public addListener(inputIndex: number, eventType: string, callback: Function) {
    if (this.isMidiSupported && this.midiInputs[inputIndex]) {
      this.midiInputs[inputIndex].addListener(eventType, "all", callback);
    }
  }
}

export default MidiManager.getInstance();
