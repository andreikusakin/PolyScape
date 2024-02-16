import * as Tone from "tone/build/esm/index";
import { Preset } from "../types/types";

export default class Effects {
  reverb: Tone.Reverb;
  private pingPongDelay: Tone.PingPongDelay;
  private distortion: Tone.Distortion;
  private chorus: Tone.Chorus;
  private vibrato: Tone.Vibrato;
  private feedbackDelay: Tone.FeedbackDelay;
  private bitCrusher: Tone.BitCrusher;
  private autoPanner: Tone.AutoPanner;
  private currentChain: Tone.ToneAudioNode[] = [];
  readonly outputNode: Tone.Gain;
  private inputNode: Tone.Gain;

  constructor(inputNode: Tone.Gain, preset: Preset["effects"]) {
    this.inputNode = inputNode;
    this.outputNode = new Tone.Gain({ gain: 0.2 });
    this.inputNode.connect(this.outputNode);
    this.reverb = new Tone.Reverb().connect(this.outputNode);
    this.pingPongDelay = new Tone.PingPongDelay();
    this.distortion = new Tone.Distortion();
    this.chorus = new Tone.Chorus();
    this.vibrato = new Tone.Vibrato();
    this.feedbackDelay = new Tone.FeedbackDelay().connect(this.outputNode);
    this.bitCrusher = new Tone.BitCrusher();
    this.autoPanner = new Tone.AutoPanner();
    this.loadPreset(preset);
  }

  private loadPreset(preset: Preset["effects"]) {
    if (preset?.reverb) {
      this.reverb.set(preset.reverb);
    }
  }

  addEffect(name: string) {
    switch (name) {
      case "reverb":
        this.currentChain.push(this.reverb);
        break;
      case "pingPongDelay":
        this.currentChain.push(this.pingPongDelay);
        break;
      case "distortion":
        this.currentChain.push(this.distortion);
        break;
      case "chorus":
        this.currentChain.push(this.chorus);
        break;
      case "vibrato":
        this.currentChain.push(this.vibrato);
        break;
      case "feedbackDelay":
        this.currentChain.push(this.feedbackDelay);
        break;
      case "bitCrusher":
        this.currentChain.push(this.bitCrusher);
        break;
      case "autoPanner":
        this.currentChain.push(this.autoPanner);
        break;
      default:
        break;
    }
    this.inputNode.disconnect();
    this.inputNode.chain(...this.currentChain);
  }

  removeEffect(name: string) {
    switch (name) {
      case "reverb":
        this.currentChain.splice(this.currentChain.indexOf(this.reverb), 1);
        break;
      case "pingPongDelay":
        this.currentChain.splice(
          this.currentChain.indexOf(this.pingPongDelay),
          1
        );
        break;
      case "distortion":
        this.currentChain.splice(this.currentChain.indexOf(this.distortion), 1);
        break;
      case "chorus":
        this.currentChain.splice(this.currentChain.indexOf(this.chorus), 1);
        break;
      case "vibrato":
        this.currentChain.splice(this.currentChain.indexOf(this.vibrato), 1);
        break;
      case "feedbackDelay":
        this.currentChain.splice(
          this.currentChain.indexOf(this.feedbackDelay),
          1
        );
        break;
      case "bitCrusher":
        this.currentChain.splice(this.currentChain.indexOf(this.bitCrusher), 1);
        break;
      case "autoPanner":
        this.currentChain.splice(this.currentChain.indexOf(this.autoPanner), 1);
        break;

      default:
        break;
    }
    this.inputNode.disconnect();
    this.inputNode.chain(...this.currentChain);
  }
}
