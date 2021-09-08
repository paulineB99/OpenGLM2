
precision mediump float;

varying vec2 tCoords;

uniform float uAlpha;
uniform float uEdge;
uniform float uColorChoice;
uniform float uThreshold;
uniform vec3 uColors[15];
uniform int uHologramEffect;
uniform sampler2D uSampler;

void main(void) {
    if (uColorChoice == 0.0){
        gl_FragColor = vec4(texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r);
    } else if (uColorChoice == 1.0){
        gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));
    } else {
        if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.2){
            gl_FragColor = vec4(uColors[0], 1);
        }else if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.4){
            gl_FragColor = vec4(uColors[1], 1);
        }else if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.6){
            gl_FragColor = vec4(uColors[2], 1);
        }else if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.8){
            gl_FragColor = vec4(uColors[3], 1);
        } else {
            gl_FragColor = vec4(uColors[4], 1);
        }
    }
    if (uEdge == 0.0){
        if (uThreshold > -0.1 && uThreshold>texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r){ 
            gl_FragColor.a = 0.0;
        }else {
            gl_FragColor.a =  texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r * uAlpha;
        }
    }
    else {
        if (uThreshold > -0.1 && uThreshold>texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r){ 
            gl_FragColor.a = 0.0;
        }else {
            gl_FragColor.a = uAlpha;
        }
    }
    if (uHologramEffect == 1){
        gl_FragColor = vec4(0.0);
        gl_FragColor.a =  texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r;
    }
    
}