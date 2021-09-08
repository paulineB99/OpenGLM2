
// =====================================================
var gl;
var shadersLoaded = 0;
var vertShaderTxt;
var fragShaderTxt;
var shaderProgram = null;
var vertexBuffer;
var colorBuffer;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
mat4.identity(objMatrix);

var listImage = [] 
var listTexture = [];

var dzPos = 0.005;
var alpha = 0.5;
var edge = 0.0;
var colorChoice = 0.0;
var distCENTER;
var posCENTER = [0,0,0];
var threshold = -1.0;
var color = [
	0.0, 0.0, 0.0,   
	0.8, 0.8, 0.1, 
	0.5, 0.2, 0.0,
	0.1, 0.1, 0.8,
	0.5, 0.0, 0.2
];

var slide = -1;
var hologramEffect = 0;

// =====================================================
function getImages(dir, fileExtension, name, firstImg, nbImg){
	for (i=firstImg; i <(nbImg+firstImg); i++){
		zeros = "";
		if (i<10){
			zeros = "00";
		}
		else if (i<100){
			zeros = "0";
		}
		else{
			zeros = "";
		}
		path = dir + "/" + name + zeros + i + fileExtension;
		listImage.push(path);
	}
}



// =====================================================
function webGLStart() {
	var canvas = document.getElementById("WebGL-test");
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	canvas.onwheel = handleMouseWheel;

	initGL(canvas);
	distCENTER = vec3.create([0,-0.2,-3]);
	initBuffers();

	getImages("image-00344", ".jpg", "image-00", 0, 361);
	
    for (i=0; i<listImage.length; i++){ 
        listTexture.push(gl.createTexture());
        initTexture(listImage[i], listTexture[i]);
    }
	loadShaders('shader');

	gl.clearColor(0.7, 0.7, 0.7, 1.0);
	gl.enable(gl.DEPTH_TEST);

	tick();
}

// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.enable(gl.DEPTH_TEST);
		gl.cullFace(gl.BACK);
		gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}

	initValues();
}

// =====================================================
function initBuffers() {
	// Vertices (array)
	vertices = [
		-0.3, -0.3, 0.0,
		-0.3,  0.3, 0.0,
		 0.3,  0.3, 0.0,
		 0.3, -0.3, 0.0];
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = 4;

	// Texture coords (array)
	texcoords = [ 
		  0.0, 0.0,
		  0.0, 1.0,
		  1.0, 1.0,
		  1.0, 0.0 ]
	texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
	texCoordBuffer.itemSize = 2;
	texCoordBuffer.numItems = 4; 
	
	// Index buffer (array)
	var indices = [ 0, 1, 2, 0, 2, 3];
	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	indexBuffer.itemSize = 1;
	indexBuffer.numItems = indices.length;
	

}


// =====================================================
function initTexture(tewImageToTexture, texture)
{
	var texImage = new Image();
	texImage.src = tewImageToTexture;

	texture.image = texImage;

	texImage.onload = function () {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.activeTexture(gl.TEXTURE0);
	}
}

// =====================================================
function loadShaders(shader) {//charge les shader .vs et .fs
	loadShaderText(shader,'.vs');
	loadShaderText(shader,'.fs');
}

// =====================================================
function loadShaderText(filename,ext) {   // technique car lecture asynchrone...
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { vertShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(ext=='.fs') { fragShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(shadersLoaded==2) {
				initShaders(vertShaderTxt,fragShaderTxt);
				shadersLoaded=0;
			}
    }
    }
    xhttp.open("GET", filename+ext, true);
    xhttp.send();
}

// =====================================================
function initShaders(vShaderTxt,fShaderTxt) {

	vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vshader, vShaderTxt);
	gl.compileShader(vshader);
	if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vshader));
		return null;
	}

	fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fshader, fShaderTxt);
	gl.compileShader(fshader);
	if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fshader));
		return null;
	}

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vshader);
	gl.attachShader(shaderProgram, fshader);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);


	shaderProgram.texCoordsAttribute = gl.getAttribLocation(shaderProgram, "texCoords"); 
	gl.enableVertexAttribArray(shaderProgram.texCoordsAttribute);
	
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	shaderProgram.zPosUniform = gl.getUniformLocation(shaderProgram, "uzPos");
	shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, "uAlpha");
	shaderProgram.edgeUniform = gl.getUniformLocation(shaderProgram, "uEdge");
	shaderProgram.colorChoiceUniform = gl.getUniformLocation(shaderProgram, "uColorChoice");
	shaderProgram.thresholdUniform = gl.getUniformLocation(shaderProgram, "uThreshold"); 
	shaderProgram.colorsUniform = gl.getUniformLocation(shaderProgram, "uColors"); 
	shaderProgram.hologramEffectUniform = gl.getUniformLocation(shaderProgram, "uHologramEffect");

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    	vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texCoordsAttribute,
    	texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

}


// =====================================================
function setMatrixUniforms(zPos) {
	if(shaderProgram != null) {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, objMatrix);
		mat4.translate(mvMatrix, posCENTER);

		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

		gl.uniform1f(shaderProgram.zPosUniform, zPos);
		gl.uniform1f(shaderProgram.alphaUniform, alpha);
		gl.uniform1f(shaderProgram.edgeUniform, edge);
		gl.uniform1f(shaderProgram.colorChoiceUniform, colorChoice);
		gl.uniform1f(shaderProgram.thresholdUniform, threshold);
		gl.uniform3fv(shaderProgram.colorsUniform, color);
		gl.uniform1i(shaderProgram.hologramEffectUniform, hologramEffect);
	}
}

// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	

	if(shaderProgram != null) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(objMatrix);
		mat4.rotate(objMatrix, rotX, [1, 0, 0]);
		mat4.rotate(objMatrix, rotY, [0, 1, 0]);
		if(slide == -1){
			zPos = -(listImage.length*0.5*dzPos);
			setMatrixUniforms(zPos);
			for (i=0; i<listImage.length; i++){
				
				gl.bindTexture(gl.TEXTURE_2D, listTexture[i]);
				gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				zPos += dzPos;
				mat4.translate(mvMatrix, [0.0, 0.0, 0.0]);
				setMatrixUniforms(zPos);
			}
		}else{
			mat4.translate(mvMatrix, [0.0, 0.0, 0.0]);
			setMatrixUniforms(0.0);
			console.log(slide);
			gl.bindTexture(gl.TEXTURE_2D, listTexture[slide]);
			gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
}