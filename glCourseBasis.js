
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
var listeImage = [] // ["cerveau/023.gif", "cerveau/024.gif", "cerveau/025.gif", "cerveau/026.gif", "cerveau/027.gif", "cerveau/028.gif", "cerveau/029.gif", "cerveau/030.gif", "cerveau/031.gif"];
var listeTexture = [];
var dzPos = 0.005;
var alpha = 0.5;
var choixContour = 0.0;
var choixColor = 0.0;
var distCENTER;
var posCENTER = [0,0,0];
var seuil = -1.0;
var color = [[0.8,0.8,0.1], [0.1,0.8,0.1], [0.6,0.1,0.1], [0.1,0.1,0.8], [[0.1,0.8,0.1]]];
var color1 = [0.1,0.8,0.1];


// if(document.getElementById("red").checked) {
// 	kd = [0.6,0.1,0.1];
// }else if(document.getElementById("green").checked) {
// 	kd = [0.1,0.8,0.1];
// }else if(document.getElementById("blue").checked) {
// 	kd = [0.1,0.1,0.8];
// }else if(document.getElementById("yellow").checked) {
// 	kd = [0.8,0.8,0.1];
// }else if(document.getElementById("cyan").checked) {
// 	kd = [0.1,0.8,0.8];
// }else if(document.getElementById("magenta").checked) {
// 	kd = [0.6,0.1,0.8];
// }


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
		//path = dir + "/" + name + i + fileExtension;
		listeImage.push(path);
		//console.log(path);
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
	//getImages("images_diverses", ".jfif", "lama", 1, 3);
	
    
    for (i=0; i<listeImage.length; i++){ 
        listeTexture.push(gl.createTexture());
        initTexture(listeImage[i], listeTexture[i]);
    }
	loadShaders('shader');
	console.log("nb images : " + listeImage.length);

	gl.clearColor(0.7, 0.7, 0.7, 1.0);
	gl.enable(gl.DEPTH_TEST); //initialisation de la profondeur

//	drawScene();
	tick();
}

// =====================================================
function initGL(canvas) //permet de lier carte graph au canva
{
	try {
		gl = canvas.getContext("experimental-webgl"); //on recup id qui permet de ?? la carte graphique
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height); //l'endroit où la carte grap peut dessiner dans le canva (ici il dessine dans tout le canva)
		gl.enable(gl.DEPTH_TEST);
		gl.cullFace(gl.BACK);
		gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}

// =====================================================
function initBuffers() { //c'est la géométrie
	// Vertices (array)
	vertices = [
		-0.3, -0.3, 0.0,
		-0.3,  0.3, 0.0,
		 0.3,  0.3, 0.0,
		 0.3, -0.3, 0.0]; //on crée un carrée de -0.3m et 0.3m, ça n'a rien a voir avec le canva
	vertexBuffer = gl.createBuffer(); //crée le buf et recup id
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); //on active le buf, tout ce qui ce fait ce faire sur lui
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); //on envoie le tableau sur le buffer qui est bind
	vertexBuffer.itemSize = 3; //taille de chaque point du buf
	vertexBuffer.numItems = 4; //nombre de point

	// Texture coords (array)
	texcoords = [ 
		  0.0, 0.0,
		  0.0, 1.0,
		  1.0, 1.0,
		  1.0, 0.0 ]; //2eme vertex buf qui va def les coord de texture
	texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
	texCoordBuffer.itemSize = 2;
	texCoordBuffer.numItems = 4; // le nbre de sommet doit etre le même pour tous les buffers
	
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
	texImage.src = tewImageToTexture;//on dit l'image qui nous interesse 

	//texture = gl.createTexture();
	texture.image = texImage;

	texImage.onload = function () {//on appel quand le navigateur aura pu charger l'image. On dit comment la texture va etre traitée
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image); //là on envoie l'image sur la carte graphique
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //linear ou nearest
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
function initShaders(vShaderTxt,fShaderTxt) {//il doit lire les 2 fichiers sur le dics dur et faire les lien

	vshader = gl.createShader(gl.VERTEX_SHADER);//crée id pour shader
	gl.shaderSource(vshader, vShaderTxt);//il lit le shader sur le disc dur
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

	shaderProgram = gl.createProgram(); //association des 2 shader
	gl.attachShader(shaderProgram, vshader);
	gl.attachShader(shaderProgram, fshader);

	gl.linkProgram(shaderProgram);//crée l'executable qui va sur la carte graphique

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");//recupe id pour acceder à aVertexPosition
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	//quand c'est un tableau, quand ça vient du vertex buff c'est des attribut et on fait les 2 lignes précedentes
	//sinon c'est uniform

	shaderProgram.texCoordsAttribute = gl.getAttribLocation(shaderProgram, "texCoords"); 
	gl.enableVertexAttribArray(shaderProgram.texCoordsAttribute);
	
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");//uSampler permet d'acceder au ?? de la texture
	
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	shaderProgram.zPosUniform = gl.getUniformLocation(shaderProgram, "uzPos");
	shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, "uAlpha");
	shaderProgram.choixContourUniform = gl.getUniformLocation(shaderProgram, "uChoixContour");
	shaderProgram.choixColorUniform = gl.getUniformLocation(shaderProgram, "uChoixColor");
	shaderProgram.seuilUniform = gl.getUniformLocation(shaderProgram, "uSeuil");
	shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor"); 
	
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
		gl.uniform1f(shaderProgram.choixContourUniform, choixContour);
		gl.uniform1f(shaderProgram.choixColorUniform, choixColor);
		gl.uniform1f(shaderProgram.seuilUniform, seuil);
		gl.uniform3fv(shaderProgram.colorUniform, color1);
	}
}


function space_slider(){
	var spaceSlider = document.getElementById("Espacement");
	dzPos = parseFloat(spaceSlider.value);
	spaceSlider.oninput = function(){
		dzPos = parseFloat(this.value);
	}
	drawScene();
}

function alpha_slider(){
	var alphaSlider = document.getElementById("Transparence");
	alpha = parseFloat(alphaSlider.value);
	alphaSlider.oninput = function(){
		alpha = parseFloat(this.value);
	}
	drawScene();
}

function setChoixContour(value){
    choixContour = value;
	drawScene();
}

function setChoixColor(value){
    choixColor = value;
	drawScene();
}

function seuil_checkbox(){
	if(document.getElementById("seuil_checkbox").checked){
		var seuilSlider = document.getElementById("seuillage");
		seuil = parseFloat(seuilSlider.value);
		seuilSlider.oninput = function(){
			seuil = parseFloat(this.value);
		}
	}else{
		seuil = -1.0;
	}
	drawScene();
}

function setColor()
{   
    var colorPicker = document.getElementById("color2");
    if (colorPicker.value!=null){
        var convertedColor = hex2rgb(colorPicker.value);
        color1 = [convertedColor[0]/255,convertedColor[1]/255 ,convertedColor[2]/255];
    }
    
}

// function seuil_checkbox(){
// 	if(document.getElementById("seuil_checkbox").checked){ 
// 		seuil = 0.0;
// 		seuil_slider();
// 	}else{
// 		seuil = -1.0;
// 	}
// 	drawScene();
// }

// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	

	if(shaderProgram != null) {
		zPos = -(listeImage.length*0.5*dzPos);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

		setMatrixUniforms(zPos);
		//console.log(seuil);

		for (i=0; i<listeImage.length; i++){
			
			gl.bindTexture(gl.TEXTURE_2D, listeTexture[i]);
			gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			zPos += dzPos;
			mat4.translate(mvMatrix, [0.0, 0.0, 0.0]);
			setMatrixUniforms(zPos);
		}
	}
}
