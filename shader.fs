
precision mediump float;

varying vec2 tCoords;//on recup tCoord

uniform sampler2D uSampler;//texture que je veux manipuler

void main(void) {
	gl_FragColor = texture2D(uSampler, vec2(tCoords.s, tCoords.t));//on peut peut-être mettre direct "tCoord" à la place de "vec2(tCoords.s, tCoords.t)" 
}

