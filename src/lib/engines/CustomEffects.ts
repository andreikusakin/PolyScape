import * as Tone from "tone/build/esm/index";
import {
  Preset,
  ReverbSettings,
  PingPongDelaySettings,
  DistortionSettings,
  ChorusSettings,
  BitCrusherSettings,
  FeedbackDelaySettings,
} from "../types/types";

const effectConfig = {
  wet: 0.5,
  decay: 2,
  preDelay: 0.01,
  feedback: 0.2,
  delayTime: "8n",
  distortion: 0.5,
  frequencyChorus: 4,
  delayTimeChorus: 3.5,
  depthChorus: 0.7,
  feedbackChorus: 0.5,
  bits: 8,
};

export default class CustomEffects {
  currentChain: Tone.ToneAudioNode[] = [];
  readonly outputNode: Tone.Gain;
  private inputNode: Tone.Gain;

  constructor(inputNode: Tone.Gain, preset: Preset["effects"]) {
    this.currentChain = [];
    this.inputNode = inputNode;
    this.outputNode = new Tone.Gain({ gain: 0.2 });
    this.inputNode.connect(this.outputNode);
    this.loadPreset(preset);
  }

  private loadPreset(preset: Preset["effects"]) {
    preset?.forEach((effect) => {
      switch (effect.type) {
        case "reverb":
          const reverbSettings = effect.settings as ReverbSettings;
          const reverb = new Tone.Reverb({
            decay: reverbSettings.decay,
            preDelay: reverbSettings.preDelay,
            wet: reverbSettings.wet / 100,
          });
          this.currentChain.push(reverb);
          break;
        case "ping pong delay":
          const pingPongDelaySettings =
            effect.settings as PingPongDelaySettings;
          const pingPongDelay = new Tone.PingPongDelay({
            feedback: pingPongDelaySettings.feedback,
            wet: pingPongDelaySettings.wet / 100,
            delayTime: pingPongDelaySettings.delayTime,
          });
          this.currentChain.push(pingPongDelay);
          break;
        case "distortion":
          const distortionSettings = effect.settings as DistortionSettings;
          const distortion = new Tone.Distortion({
            distortion: distortionSettings.distortion,
            wet: distortionSettings.wet / 100,
          });
          this.currentChain.push(distortion);
          break;

        case "chorus":
          const chorusSettings = effect.settings as ChorusSettings;
          const chorus = new Tone.Chorus({
            frequency: chorusSettings.frequency,
            delayTime: chorusSettings.delayTime,
            depth: chorusSettings.depth,
            feedback: chorusSettings.feedback,
            wet: chorusSettings.wet / 100,
          });
          this.currentChain.push(chorus);
          break;
        case "bitcrusher":
          const bitCrusherSettings = effect.settings as BitCrusherSettings;
          const bitCrusher = new Tone.BitCrusher({
            bits: bitCrusherSettings.bits,
          });
          bitCrusher.wet.value = bitCrusherSettings.wet / 100;
          this.currentChain.push(bitCrusher);
          break;
        case "delay":
          const delaySettings = effect.settings as FeedbackDelaySettings;
          const delay = new Tone.FeedbackDelay({
            delayTime: delaySettings.delayTime,
            feedback: delaySettings.feedback,
            wet: delaySettings.wet / 100,
          });
          this.currentChain.push(delay);
          break;
        default:
          break;
      }
    });
    this.inputNode.disconnect();

    this.inputNode.chain(...this.currentChain, this.outputNode);
  }

  addEffect(name: string) {
    let effect;
    switch (name) {
      case "reverb":
        effect = new Tone.Reverb({
          decay: effectConfig.decay,
          preDelay: effectConfig.preDelay,
          wet: effectConfig.wet,
        });
        this.currentChain.push(effect);
        break;
      case "ping pong delay":
        effect = new Tone.PingPongDelay({
          feedback: effectConfig.feedback,
          wet: effectConfig.wet,
          delayTime: effectConfig.delayTime,
        });
        this.currentChain.push(effect);
        break;
      case "distortion":
        effect = new Tone.Distortion({
          distortion: effectConfig.distortion,
          wet: effectConfig.wet,
        });
        this.currentChain.push(effect);
        break;
      case "chorus":
        effect = new Tone.Chorus({
          frequency: effectConfig.frequencyChorus,
          delayTime: effectConfig.delayTimeChorus,
          depth: effectConfig.depthChorus,
          feedback: effectConfig.feedbackChorus,
          wet: effectConfig.wet,
        });
        this.currentChain.push(effect);
        break;

      case "bitcrusher":
        effect = new Tone.BitCrusher({
          bits: effectConfig.bits,
        });
        effect.wet.value = effectConfig.wet;
        this.currentChain.push(effect);
        break;
      case "delay":
        effect = new Tone.FeedbackDelay({
          delayTime: effectConfig.delayTime,
          feedback: effectConfig.feedback,
          wet: effectConfig.wet,
        });
        this.currentChain.push(effect);
        break;
      default:
        break;
    }
    this.inputNode.disconnect();

    this.inputNode.chain(...this.currentChain, this.outputNode);
    console.log(this.currentChain);
  }

  deleteEffect(index: number) {
    console.log("called delete effect");
    this.currentChain[index].disconnect();
    this.currentChain[index].dispose();
    this.currentChain.splice(index, 1);
    this.inputNode.disconnect();
    this.inputNode.chain(...this.currentChain, this.outputNode);
    console.log(this.currentChain);
  }

  muteEffect(index: number) {}

  dispose() {
    this.inputNode.disconnect();
    this.currentChain.forEach((effect) => {
      effect.disconnect();
      effect.dispose();
    });
    this.outputNode.disconnect();
    this.inputNode.dispose();
    this.outputNode.dispose();
  }
}
