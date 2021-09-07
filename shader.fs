
precision mediump float;

varying vec2 tCoords;//on recup tCoord
uniform float uAlpha;
uniform float uChoixContour;
uniform float uSeuil;

uniform sampler2D uSampler;//texture que je veux manipuler

void main(void) {
    //gl_FragColor = vec4(texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r);
    if (uSeuil != -1.0 && uSeuil>texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r){
        gl_FragColor = vec4(0.0);
    } else {
        gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));
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