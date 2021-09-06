
precision mediump float;

varying vec2 tCoords;//on recup tCoord
uniform float uAlpha;
uniform float uChoixContour;

uniform sampler2D uSampler;//texture que je veux manipuler

void main(void) {
    if (uChoixContour == 0.0) {
        // gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));
        gl_FragColor = vec4(texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r);//on peut peut-être mettre direct "tCoord" à la place de "vec2(tCoords.s, tCoords.t)"
        gl_FragColor.a =  texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r * uAlpha;
    }
    else {
        gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));//on peut peut-être mettre direct "tCoord" à la place de "vec2(tCoords.s, tCoords.t)"
        gl_FragColor.a =  uAlpha;
    }
}