
function updateSlider(id, newvalue) {
    document.getElementById(id).innerHTML = newvalue;
	drawScene();
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


function setEdge(value){
    edge = value;
}

function setColorChoice(value){
    colorChoice = value;
	if (colorChoice == 0.5){
		document.getElementById("thFakeColors").style.visibility = "Visible";
	}else {
		document.getElementById("thFakeColors").style.visibility = "hidden";
	}
	drawScene();
}

function threshold_checkbox(){
	if(document.getElementById("threshold_checkbox").checked){
		//document.getElementById("DvHP").style.visibility = "Visible";
		var thresholdSlider = document.getElementById("threshold");
		thresholdSlider.style.visibility = "Visible";
		document.getElementById("sliderThresholdAmount").style.visibility = "Visible";
		threshold = parseFloat(thresholdSlider.value);
		thresholdSlider.oninput = function(){
			threshold = parseFloat(this.value);
		}
	}else{
		document.getElementById("threshold").style.visibility = "hidden";
		document.getElementById("sliderThresholdAmount").style.visibility = "hidden";
		threshold = -1.0;
	}
    updateSlider("sliderThresholdAmount", threshold);
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
		updateSlider("sliderslideByslideAmount", s);
		document.getElementById("slideByslideRange").style.visibility = "Visible";
		document.getElementById("sliderslideByslideAmount").style.visibility = "Visible";
		drawScene();
	}else{
		slide = -1;
		document.getElementById("slideByslideRange").style.visibility = "hidden";
		document.getElementById("sliderslideByslideAmount").style.visibility = "hidden";
	}

}

function hologram_Effect(){
	if(document.getElementById("hologramEffect").checked){
		hologramEffect = 1;
	}else{
		hologramEffect = 0;
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
	document.getElementById("show").value = false;
	//document.getElementById(show).innerHTML = 0.0;

	//Couleurs des images

	//Seuillage
	document.getElementById("threshold_checkbox").checked = false;
	threshold = -1.0;
	document.getElementById("threshold").value = threshold;
	updateSlider("sliderThresholdAmount", threshold);
	document.getElementById("threshold").style.visibility = "hidden";
	document.getElementById("sliderThresholdAmount").style.visibility = "hidden";

	//Gestion des fausses couleurs
	document.getElementById("thFakeColors").style.visibility = "hidden";

	//Vision 2D
	document.getElementById("slideByslideBox").checked = false;
	slide = -1;
	document.getElementById("slideByslideRange").value = slide;
	updateSlider("sliderslideByslideAmount", slide);
	document.getElementById("slideByslideRange").style.visibility = "hidden";
	document.getElementById("sliderslideByslideAmount").style.visibility = "hidden";

	
	document.getElementById("hologramEffect").checked = false;

	document.getElementById("0color").value = "#000000";
	document.getElementById("1color").value = "#cccc19";
	document.getElementById("2color").value = "#7f3300";
	document.getElementById("3color").value = "#1919cc";
	document.getElementById("4color").value = "#7f0033";

	document.getElementById("blackaAndWhite").checked = true;
	document.getElementById("notShow").checked = true;
}