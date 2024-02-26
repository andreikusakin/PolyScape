import * as Tone from "tone/build/esm/index";
import { Preset } from "../types/types";

const effectConfig = {
  wet: 0.5,
  decay: 2,
  preDelay: 0.01,
}
//mute all effects

export default class Effects {
  currentChain: Tone.ToneAudioNode[] = [];
  readonly outputNode: Tone.Gain;
  private inputNode: Tone.Gain;
  
  constructor(inputNode: Tone.Gain, preset: Preset["effects"]) {
    this.currentChain = [];
    this.inputNode = inputNode;
    this.outputNode = new Tone.Gain({ gain: 0.2 });
    this.inputNode.connect(this.outputNode);
    // this.reverb = new Tone.Reverb({ decay: 2, preDelay: 0, wet: 0.5})
    // this.pingPongDelay = new Tone.PingPongDelay();
    // this.distortion = new Tone.Distortion();
    // this.chorus = new Tone.Chorus();
    // this.vibrato = new Tone.Vibrato();
    // this.feedbackDelay = new Tone.FeedbackDelay()
    // this.bitCrusher = new Tone.BitCrusher();
    // this.autoPanner = new Tone.AutoPanner();

    
    this.loadPreset(preset);
    
    
  }

  private loadPreset(preset: Preset["effects"]) {
    
    preset?.forEach((effect) => {
      switch (effect.type) {
        case "reverb":
          const reverb = new Tone.Reverb({
            decay: effect.settings.decay,
            preDelay: effect.settings.preDelay,
            wet: effect.settings.wet / 100,
          }
           
          );
          this.currentChain.push(reverb);
          break;
        case "pingPongDelay":
          const pingPongDelay = new Tone.PingPongDelay({
            feedback: effect.settings.feedback,
            wet: effect.settings.wet / 100,
            delayTime: effect.settings.delayTime,
          });
          this.currentChain.push(pingPongDelay);
          break;
        // case "distortion":
        //   const distortion = new Tone.Distortion(effect.settings);
        //   this.currentChain.push(distortion);
        //   break;
        // case "chorus":
        //   const chorus = new Tone.Chorus(effect.settings);
        //   this.currentChain.push(chorus);
        //   break;
        // case "vibrato":
        //   const vibrato = new Tone.Vibrato(effect.settings);
        //   this.currentChain.push(vibrato);
        //   break;
        // case "feedbackDelay":
        //   const feedbackDelay = new Tone.FeedbackDelay(effect.settings);
        //   this.currentChain.push(feedbackDelay);
        //   break;
        // case "bitCrusher":
        //   const bitCrusher = new Tone.BitCrusher(effect.settings);
        //   this.currentChain.push(bitCrusher);
        //   break;
        // case "autoPanner":
        //   const autoPanner = new Tone.AutoPanner(effect.settings);
        //   this.currentChain.push(autoPanner);
        //   break;
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
      case "pingPongDelay":
        effect = new Tone.PingPongDelay({
          feedback: effectConfig.feedback,
          wet: effectConfig.wet,
          delayTime: effectConfig.delayTime,
        });
        this.currentChain.push(effect);
        break;
      // case "distortion":
      //   const distortion = new Tone.Distortion();
      //   this.currentChain.push(distortion);
      //   break;
      // case "chorus":
      //   const chorus = new Tone.Chorus();
      //   this.currentChain.push(chorus);
      //   break;
      // case "vibrato":
      //   const vibrato = new Tone.Vibrato();
      //   this.currentChain.push(vibrato);
      //   break;
      // case "feedbackDelay":
      //   const feedbackDelay = new Tone.FeedbackDelay();
      //   this.currentChain.push(feedbackDelay);
      //   break;
      // case "bitCrusher":
      //   const bitCrusher = new Tone.BitCrusher();
      //   this.currentChain.push(bitCrusher);
      //   break;
      // case "autoPanner":
      //   const autoPanner = new Tone.AutoPanner();
      //   this.currentChain.push(autoPanner);
      //   break;
      default:
        break;
    }
    this.inputNode.disconnect();
    
    this.inputNode.chain(...this.currentChain, this.outputNode);
    console.log(this.currentChain)
    
  }

 deleteEffect(index: number) {
    console.log('called delete effect')
    this.currentChain[index].disconnect();
    this.currentChain[index].dispose();
    this.currentChain.splice(index, 1);
    this.inputNode.disconnect();
    this.inputNode.chain(...this.currentChain, this.outputNode);
    console.log(this.currentChain)
 }

  muteEffect(index: number) {
    
  }
}
