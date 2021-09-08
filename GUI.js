
function updateSlider(id, newvalue) {
    document.getElementById(id).innerHTML = newvalue;
}

function space_slider(){
	var spaceSlider = document.getElementById("Espacement");
	dzPos = parseFloat(spaceSlider.value);
	spaceSlider.oninput = function(){
		dzPos = parseFloat(this.value);
	}
    updateSlider("sliderEspacementAmount", dzPos);
	drawScene();
}

function alpha_slider(){
	var alphaSlider = document.getElementById("Transparence");
	alpha = parseFloat(alphaSlider.value);
	alphaSlider.oninput = function(){
		alpha = parseFloat(this.value);
	}
    updateSlider("sliderTransparenceAmount", alpha);
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
    updateSlider("sliderSeuillageAmount", seuil);
	drawScene();
}

function hex2rgb(hex) 
{
   // long version
   var r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
   if (r) {
           return r.slice(1,4).map(function(x) { return parseInt(x, 16); });
   }
   // short version
   var r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
   if (r) {
           return r.slice(1,4).map(function(x) { return 0x11 * parseInt(x, 16); });
   }
}

function setColor(id)
{   
	console.log("dans setColor");
    var colorPicker = document.getElementById(id);
	console.log(colorPicker);
	//num = id[5];
	i = parseInt(id);
	console.log(id);
	console.log(i);

    if (colorPicker.value!=null){
        var convertedColor = hex2rgb(colorPicker.value);
		setColorby3(i, convertedColor[0]/255, convertedColor[1]/255, convertedColor[2]/255);
    }
	drawScene();
}

function setColorby3(i, r, g, b)
{
	color[i*3] = r;
	color[i*3+1] = g;
	color[i*3+2] = b;
}

function slideByslide(){
	if(document.getElementById("slideByslideBox").checked){
		var slideSlider = document.getElementById("slideByslideRange");
		slide = parseFloat(slideSlider.value);
		slideSlider.oninput = function(){
			slide = parseFloat(this.value);
		}
		s = parseInt(slide);
		updateSlider("slideByslideRange", s);
		drawScene();
	}else{
		slide = -1;
	}
    
}

function effet_Cool(){
	if(document.getElementById("effetHolograme").checked){
		effetHolograme = 1;
	}else{
		effetHolograme = 0;
	}
}

function initValues(){
	//Espacement
	space = 0.02;
	document.getElementById("Espacement").value = space;
	updateSlider("sliderEspacementAmount", space);

	//Transparence
	transp = 0.02;
	document.getElementById("Transparence").value = transp;
	updateSlider("sliderTransparenceAmount", transp);

	//Affichage contour
	document.getElementById("show").value = 0.0;
	//document.getElementById(show).innerHTML = 0.0;

	//Couleurs des images

	//Seuillage
	document.getElementById("seuil_checkbox").checked = false;
	seuil = 0.02;
	document.getElementById("seuillage").value = seuil;
	updateSlider("sliderSeuillageAmount", seuil);

	//Gestion des fausses couleurs

	//Vision 2D
	document.getElementById("slideByslideBox").checked = false;
	slide = 0;
	document.getElementById("slideByslideRange").value = slide;
	updateSlider("sliderslideByslideAmount", slide);

	
	document.getElementById("effetHolograme").checked = false;
}