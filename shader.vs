
attribute vec3 aVertexPosition;
attribute vec2 texCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
//matrices de rotation, tranlation, ...
uniform float uzPos;

varying vec2 tCoords;

void main(void) {
	tCoords = texCoords; //texCoords = les coord d'un point dans la texture (donc entre 0 et 1)

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(0.0, 0.0, uzPos), 1.0);
}
