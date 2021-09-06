
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var distCENTER;
var posCENTER = [0,0,0];
// =====================================================

var PLANE = null;
var OBJS =[]; //tableau avec tous les objets



// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

class objmesh {

	// --------------------------------------------
	constructor(objFname) {
		this.objName = objFname;
		this.shaderName = 'obj';
		this.loaded = -1;
		this.shader = null;
		this.mesh = null;
		this.ALPHA = 0.5; 
		this.Kd = (0.3,0.5,0.8);
		this.Ks = 0.5;
		this.wire = 0;
		this.choixFS = 1.0; //choix entre Lambert (pour la transparence) alors choixFS=1.0 et Phong (pour la brillance) alors choixFS différent de 1.0

		loadObjFile(this);
		loadShaders(this);

		
		this.shader1 = { fname:'obj'};
		loadShadersNEW(this.shader1)

		this.shader2 = { fname:'wire'};
		loadShadersNEW(this.shader2)
	}

	

	// --------------------------------------------
	setShadersParams() {

		gl.useProgram(this.shader1.shader);

		this.shader1.shader.vAttrib = gl.getAttribLocation(this.shader1.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader1.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader1.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader1.shader.nAttrib = gl.getAttribLocation(this.shader1.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader1.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader1.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader1.shader.rMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uRMatrix");
		this.shader1.shader.mvMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uMVMatrix");
		this.shader1.shader.pMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uPMatrix");
		this.shader1.shader.uAlpha = gl.getUniformLocation(this.shader1.shader, "uAlpha"); 
		this.shader1.shader.choixFSUniform = gl.getUniformLocation(this.shader1.shader, "choixFS");
		this.shader1.shader.uKd = gl.getUniformLocation(this.shader1.shader, "uKd"); 
		this.shader1.shader.uKs = gl.getUniformLocation(this.shader1.shader, "uKs"); 


	}
	setShadersParams2() {
		gl.useProgram(this.shader2.shader);

		this.shader2.shader.vAttrib = gl.getAttribLocation(this.shader2.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader2.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader2.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader2.shader.nAttrib = gl.getAttribLocation(this.shader2.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader2.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader2.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader2.shader.rMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uRMatrix");
		this.shader2.shader.mvMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uMVMatrix");
		this.shader2.shader.pMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uPMatrix");
		this.shader2.shader.uAlpha = gl.getUniformLocation(this.shader2.shader, "uAlpha"); 
		this.shader2.shader.choixFSUniform = gl.getUniformLocation(this.shader2.shader, "choixFS");
		this.shader2.shader.uKd = gl.getUniformLocation(this.shader2.shader, "uKd"); 
		this.shader2.shader.uKs = gl.getUniformLocation(this.shader2.shader, "uKs");
	}
	
	// --------------------------------------------
	setMatrixUniforms() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER); //Après la rotation (on met l'objet devant l'oeil)
		mat4.multiply(mvMatrix, rotMatrix);
		mat4.translate(mvMatrix, posCENTER); //Avant la rotation (déplacement de la scène)

		gl.uniformMatrix4fv(this.shader1.shader.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader1.shader.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader1.shader.pMatrixUniform, false, pMatrix);
		gl.uniform1f(this.shader1.shader.uAlpha,this.ALPHA);
		gl.uniform1f(this.shader1.shader.choixFSUniform,this.choixFS);
		gl.uniform1f(this.shader1.shader.uKd,this.Kd);
		gl.uniform1f(this.shader1.shader.uKs,this.Ks);
	}

	setMatrixUniforms2() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER); //Après la rotation (on met l'objet devant l'oeil)
		mat4.multiply(mvMatrix, rotMatrix);
		mat4.translate(mvMatrix, posCENTER); //Avant la rotation (déplacement de la scène)
	
		gl.uniformMatrix4fv(this.shader2.shader.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader2.shader.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader2.shader.pMatrixUniform, false, pMatrix);
		gl.uniform1f(this.shader2.shader.uAlpha,this.ALPHA);
		gl.uniform1f(this.shader2.shader.choixFSUniform,this.choixFS);
		gl.uniform1f(this.shader2.shader.uKd,this.Kd);
		gl.uniform1f(this.shader2.shader.uKs,this.Ks);
	}
	
	// --------------------------------------------


	draw1() {
		if(this.shader1.shader && this.mesh != null) {
			this.setShadersParams();
			this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		
		}
	}

	draw2() {
		if(this.shader2.shader && this.mesh != null) {
			this.setShadersParams2();
			this.setMatrixUniforms2();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexEdgeBuffer);
			gl.drawElements(gl.LINES, this.mesh.indexEdgeBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}

	draw(){
		this.draw1();
		if (this.wire == 1) {
			this.draw2();
		}
	}


}



// =====================================================
// PLAN 3D, Support géométrique
// =====================================================

class plane {
	
	// --------------------------------------------
	constructor() {
		this.shaderName='plane';
		this.loaded=-1;
		this.shader=null;
		this.initAll();
	}
		
	// --------------------------------------------
	initAll() {
		var size=1.0;
		var vertices = [
			-size, -size, 0.0,
			 size, -size, 0.0,
			 size, size, 0.0,
			-size, size, 0.0
		];

		var texcoords = [
			0.0,0.0,
			0.0,1.0,
			1.0,1.0,
			1.0,0.0
		];

		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 4;

		this.tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		this.tBuffer.itemSize = 2;
		this.tBuffer.numItems = 4;

		loadShaders(this);
	}
	
	
	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
		gl.enableVertexAttribArray(this.shader.tAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
	}


	// --------------------------------------------
	setMatrixUniforms() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		mat4.translate(mvMatrix, posCENTER);
		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
	}

	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();
			this.setMatrixUniforms(this);
			
			gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
			gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
		}
	}

}


// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================



// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.7, 0.7, 0.7, 1.0); //"couleur" du fond
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE); //pour la gestion du "backface culling"
		gl.cullFace(gl.BACK); //désactivation du "backface culling" (suppression des faces arrières)

		//gestion de la transparence
		gl.enable(gl.BLEND); //permet la fusion des couleurs
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}


// =====================================================
loadObjFile = function(OBJ3D)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var tmpMesh = new OBJ.Mesh(xhttp.responseText);
			OBJ.initMeshBuffers(gl,tmpMesh);
			OBJ3D.mesh=tmpMesh;

			tmpMesh.indicesEdges =[];
			for (var i=0; i < OBJ3D.mesh.indices.length; i+=3){
				tmpMesh.indicesEdges.push(OBJ3D.mesh.indices[i],OBJ3D.mesh.indices[i+1]);
				tmpMesh.indicesEdges.push(OBJ3D.mesh.indices[i+1],OBJ3D.mesh.indices[i+2]);
				tmpMesh.indicesEdges.push(OBJ3D.mesh.indices[i+2],OBJ3D.mesh.indices[i]);
			}

			OBJ3D.mesh.indexEdgeBuffer = gl.createBuffer();
    		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OBJ3D.mesh.indexEdgeBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tmpMesh.indicesEdges), gl.STATIC_DRAW);
			OBJ3D.mesh.indexEdgeBuffer.itemSize = 1;
			OBJ3D.mesh.indexEdgeBuffer.numItems = tmpMesh.indicesEdges.length;
		}
	}

	xhttp.open("GET", OBJ3D.objName, true);
	xhttp.send();
}

// =====================================================
function loadShadersNEW(shader) {
	loadShaderTextNEW(shader,'.vs');
	loadShaderTextNEW(shader,'.fs');
}


// =====================================================
function loadShaderTextNEW(shader,ext) {   // lecture asynchrone...
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { shader.vsTxt = xhttp.responseText; shader.loaded ++; }
			if(ext=='.fs') { shader.fsTxt = xhttp.responseText; shader.loaded ++; }
			if(shader.loaded==2) {
				shader.loaded ++;
				compileShaders(shader);
				shader.loaded ++;
				console.log("Shader '"+shader.fname + "' COMPILED !");
			}
		}
	}

	shader.loaded = 0;
	xhttp.open("GET", shader.fname+ext, true);
	xhttp.send();
}
// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(Obj3D.loaded==2) {
			Obj3D.loaded ++;
			compileShaders(Obj3D);
			Obj3D.loaded ++;
		}
	}
  }
  
  Obj3D.loaded = 0;
  xhttp.open("GET", Obj3D.shaderName+ext, true);
  xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.shaderName+".vs");
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
	}

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.shaderName+".fs");
		console.log(gl.getShaderInfoLog(Obj3D.fshader));
	}

	Obj3D.shader = gl.createProgram();
	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);
	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getShaderInfoLog(Obj3D.shader));
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
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	
	mat4.identity(rotMatrix);
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

	distCENTER = vec3.create([0,-0.2,-3]); //distance de la scène
	
	PLANE = new plane();
	OBJS.push(new objmesh('bunny.obj'));
	OBJS.push(new objmesh('porschemodif.obj'));

	tick();
}

// =====================================================

function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT);
	PLANE.draw();
	OBJS[0].draw();
	OBJS[1].draw();

}

