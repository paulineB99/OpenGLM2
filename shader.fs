
precision mediump float;

varying vec2 tCoords;//on recup tCoord
uniform float uAlpha;
uniform float uChoixContour;
uniform float uChoixColor;
uniform float uSeuil;
uniform vec3 uColor;

uniform sampler2D uSampler;//texture que je veux manipuler

void main(void) {
    //gl_FragColor = vec4(texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r);
    if (uSeuil != -1.0 && uSeuil>texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r){
        gl_FragColor = vec4(0.0);
    } else {
        //gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));
        if (uChoixColor == 0.0){ // surement à mettre dans le else au dessus
            gl_FragColor = vec4(texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r);
        } else if (uChoixColor == 1.0){
            gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));
        } else {
            if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.2){
                gl_FragColor = vec4(0.8, 0.4, 0.1, 1);
            }else if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.4){
                gl_FragColor = vec4(uColor, 1);
            }else if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.6){
                gl_FragColor = vec4(0.4, 0.4, 0.3, 1);
            }else if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.8){
                gl_FragColor = vec4(uColor, 1);
            } else {
                gl_FragColor = vec4(0.1, 0.1, 0.8, 1);
            }
            //gl_FragColor = fakeColors();
        }
    }

    //on peut peut-être mettre direct "tCoord" à la place de "vec2(tCoords.s, tCoords.t)"
    if (uChoixContour == 0.0) {
        //on peut peut-être mettre direct "tCoord" à la place de "vec2(tCoords.s, tCoords.t)"
        gl_FragColor.a =  texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r * uAlpha;
    }
    else {
        gl_FragColor.a =  uAlpha;
    }
}

// vec4 fakeColors() {
//     if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.2){
//         gl_FragColor = vec4(0.8, 0.4, 0.1, 1);
//     }else if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.5){
//         gl_FragColor = vec4(0.4, 0.4, 0.3, 1);
//     }else if (texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r < 0.8){
//         gl_FragColor = vec4(0.1, 0.4, 0.5, 1);
//     } else {
//         gl_FragColor = vec4(0.1, 0.1, 0.8, 1);
//     }
//     return gl_FragColor;
// }