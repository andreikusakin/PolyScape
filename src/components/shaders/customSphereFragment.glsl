varying float vWobble;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uRFactor; 
uniform float uGFactor; 
uniform float uBFactor; 
uniform float uColorIntensity;

voin main() { 
    float RFactor = 1.0;
    float colorMix = smoothstep(-1.0, 1.0, vWobble);
    csm_DiffuseColor.rgb = mix(uColorA * uColorIntensity * 0.1, uColorB * uColorIntensity * 2.0, colorMix);   
}