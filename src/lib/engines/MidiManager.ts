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
        // Check permission status using the Permissions API (if supported)
        if (navigator.permissions) {
          navigator.permissions
            .query({ name: "midi" as PermissionName, sysex: false } as any)
            .then((result) => {
              if (result.state === "granted") {
                WebMidi.enable({
                  callback: (err: any) => {
                    if (err) {
                      console.error("WebMidi could not be enabled.", err);
                      this.isMidiSupported = false;
                    } else {
                      console.log("WebMidi enabled");
                      this.isMidiSupported = true;
                      this.midiInputs = WebMidi.inputs;
                    }
                  },
                  sysex: false
                });
              } else if (result.state === "prompt") {
                console.log("MIDI permission prompt (not yet granted)");
              } else {
                console.log("MIDI permission denied");
              }
            })
            .catch((err) => {
              console.error("Permissions query error", err);
            });
        } else {
  
          navigator.requestMIDIAccess({ sysex: false })
            .then((midiAccess) => {
              console.log("MIDI access granted", midiAccess);
              WebMidi.enable({
                callback: (err: any) => {
                  if (err) {
                    console.error("WebMidi could not be enabled.", err);
                    this.isMidiSupported = false;
                  } else {
                    console.log("WebMidi enabled");
                    this.isMidiSupported = true;
                    this.midiInputs = WebMidi.inputs;
                  }
                },
                sysex: false
              });
            })
            .catch((error) => {
              console.error("MIDI access denied", error);
            });
        }
      } else {
        console.error("Web MIDI API is not supported in this browser.");
      }
    // if (navigator.requestMIDIAccess) {
    //   WebMidi.enable((err) => {
    //     if (err) {
    //       console.error("WebMidi could not be enabled.", err);
    //       this.isMidiSupported = false;
    //     } else {
    //       console.log("WebMidi enabled");
    //       this.isMidiSupported = true;
    //       this.midiInputs = WebMidi.inputs;
    //     }
    //   });
    // } else {
    //   console.error("Web MIDI API is not supported in this browser.");
    //   this.isMidiSupported = false;
    // }
  }

  // Optionally, add helper methods to add or remove listeners.
  public addListener(inputIndex: number, eventType: string, callback: Function) {
    if (this.isMidiSupported && this.midiInputs[inputIndex]) {
      this.midiInputs[inputIndex].addListener(eventType, "all", callback);
    }
  }
}

export default MidiManager.getInstance();
