
var wwidth = 1200;
var heightt = 610;
var geoMapHeight;
var geoMapWidth;
var data_list=[];
var slider_dict={};
var button_dict={};

t_l_lat = 42.21239;
b_r_lat = 42.41026;
t_l_lon = -71.27368;
b_r_lon = -70.88795;
var projected_t_l;
var projected_b_r;

var legend_x, legend_y, legend_space;

var default_category = "atm";



var category_color_lookup = {
	"bank":60,
	"grocery store":0,
	"park":105,
	"pharmacy":197,
	"school":228,
	"subway station": 261,
	"restaurant": 170,
	"atm": 340,
	"bar": 280,
	"clothing store": 35,
	"laundry": 300
}


// var category_max_lookup = {
// 	"bank":53.31667,
// 	"grocery or supermarket":41.71667,
// 	"park":48.18333,
// 	"pharmacy":35.58333,
// 	"school":38.56667,
// 	"subway station": 94.75000
// }

function preload() {

plainFont = loadFont("data/Roboto-Light.ttf");
boldFont = loadFont("data/Roboto-Bold.ttf");

dataTable = loadTable("data/data.csv", "header");
//cellTable = loadTable("data/cells_xy.csv", "header");
cellTable = loadTable("data/centroids.csv", "header");
max_valueTable = loadTable("data/max_values.csv", "header")
}


function setup() {
	createCanvas(window.innerWidth, window.innerHeight);  
	legend_x = window.innerWidth*0.72;
	legend_y = window.innerHeight*0.262295082;
	legend_space = 32;//window.innerHeight*0.03766666667;


	// Resize the canvas when the screen size changes
  	// window.onresize = function(){
  		// updateLegendLocations(leged_dict)
 //  	legend_x = window.innerWidth*0.775;
	// legend_y = window.innerHeight*0.262295082;
	// legend_space = window.innerHeight*0.03766666667;
  	// }




	// createCanvas(wwidth, heightt);
	projected_t_l = projectMercator(t_l_lon, t_l_lat);
 	projected_b_r = projectMercator(b_r_lon, b_r_lat);
	
	img = loadImage("data/map_alpha_2.png");
	// console.log(cellTable)

	legend_dict = legend(max_valueTable);
	//console.log(leged_dict);
	legend_draw(legend_dict);
	slider_draw(legend_dict);
}

function draw() {
	legend_x = window.innerWidth*0.72;
	legend_y = window.innerHeight*0.262295082;
	legend_space = 32;//window.innerHeight*0.03766666667;
	

	var filtered_data = dataTable.findRows(default_category, "category");
	
	data_list.push(filtered_data);
	background(255);
	fill(0);
	noStroke();
	textSize(22);
	text("Where would you like to live?", legend_x, legend_y-130);
	fill(30);
	noStroke();
	textSize(14);
	text("in Boston, MA", legend_x, legend_y-110);
	fill(0);
	textSize(15.5);
	text("Choose the area you'd like to live in based on", legend_x, legend_y-80);
	text("the time you are willing to walk to amenities around", legend_x, legend_y-60);


	fill(25, 0, 75, 1);
	noStroke();
	ellipse(legend_x+25, window.innerHeight-100, 25);
	
	textSize(13);
	fill(30, 0, 0, 1);
	text("population size in area", legend_x+70, window.innerHeight-108);
	stroke(25, 0, 75, 0.8);
	strokeWeight(1.5);
	line(legend_x+30, window.innerHeight-110, legend_x+65, window.innerHeight-110)
	//line(legend_x+60, window.innerHeight-120, legend_x+180, window.innerHeight-120)


	textSize(13);
	fill(0, 0, 0, 1);
	noStroke();
	text("radius of walking distance (meters)", legend_x+110, window.innerHeight-82);
	stroke(25, 0, 75, 0.8);
	strokeWeight(1.5);
	line(legend_x+47, window.innerHeight-85, legend_x+105, window.innerHeight-85)


	noStroke();
	fill(0);
	textSize(11);

	text("Data sources - Google Places API & NASA", legend_x, .94*window.innerHeight);

	var l_b = createElement("a","By");
	l_b.position(legend_x, .96*window.innerHeight)
	l_b.style('font-family: "Roboto"; font-style: "lighter"; font-size: 11px; border:none; background-color:white;')
var l_b2 = createElement("a","&");
	l_b2.position(legend_x+95, .96*window.innerHeight)
		l_b2.style('font-family: "Roboto"; font-style: "lighter"; font-size: 11px; border:none; background-color:white;')

	var l_t = createA("http://www.taliakaufmann.com/","Talia Kaufmann");
	l_t.position(legend_x+15, .96*window.innerHeight)
	var l_e = createA('http://arminakhavan.co', " Armin Akhavan")
	l_e.position(legend_x+105, .96*window.innerHeight);
	l_t.style('font-family: "Roboto"; font-style: "lighter"; font-size: 11px; border:none; background-color:white;')

	l_e.style('font-family: "Roboto"; font-style: "lighter"; font-size: 11px; border:none; background-color:white;')


	colorMode(HSL, 360, 100, 100, 1);
	image(img,0,0, 0.7*window.innerWidth, 0.7*0.707*window.innerWidth);  


if (frameCount < 250){
	textSize(13);
	fill(30, 0, 0, 1);
	text("click to", legend_x-200, legend_y+5);
	text("explore amenities", legend_x-200, legend_y+25);
	stroke(25, 0, 75, 0.8);
	strokeWeight(1.5);
	line(legend_x-80, legend_y+12, legend_x-7, legend_y+12);

	noStroke();
	text("hover over map", legend_x-200, legend_y+100);
	text("explore data", legend_x-200, legend_y+120);
	stroke(25, 0, 75, 0.8);
	line(legend_x-215, legend_y+107, legend_x-350, legend_y+107)
}


	//legend and sliders
	var data_table = data_list[0];
    // console.log(data_table)//, data_list);
	// console.log("dataTable",dataTable)
    for (var i = 1; i < data_table.length; i++) {
    	var bri = 100;
    	var b = i+".0"
    	
    	var data = data_table[i];//data_table.findRows(b, "id_grid");
    		var _id = data.arr[0];
    		var id = _id.replace(".0","");

    			var walking = +data.arr[2];
				var category = data.arr[1];
    			var max_val = legend_dict[default_category][0];
    			bri = map(walking,0,max_val,40,95);
    			var alpha = map(walking,0,max_val,1,0.1);



    			if (cellTable.findRow(""+id, "shapeid")){
		    		var points = cellTable.findRow(""+id, "shapeid");
		    		var centroidsPoints = projectedPoints([points]);

		    		var pop = +data.arr[4];
	    			pop_size = map(pop, 142, 12888, 2, 15);
	    			fill(25, 0, 75, 1);
	    			noStroke();
	    		
	    			
		    		

		    		var distance = +data.arr[3];
		    		
		    		radius = map(Math.sqrt(distance), 0, Math.sqrt(6002), 0,window.innerWidth*0.04);
		    		

		    		if (walking< slider_dict[category].value()){

			    		ellipse(centroidsPoints[0][0], centroidsPoints[0][1],pop_size);
			    		strokeWeight(1.75);
			    		noFill();
		    			stroke(category_color_lookup[category], 60, bri, 1);
			    		ellipse(centroidsPoints[0][0], centroidsPoints[0][1],radius, radius*1.05);
			    		
			    		strokeWeight(1);
			    		ellipse(legend_x+25, window.innerHeight-100, 50);

			    		centroid_hover(centroidsPoints[0], 10, pop, walking)
			    		
		    		}







		//draw rectangles
		   //  		beginShape();
					// vertex(rect_points[0][0], rect_points[0][1]);
					// vertex(rect_points[1][0], rect_points[1][1]);
					// vertex(rect_points[2][0], rect_points[2][1]);
					// vertex(rect_points[3][0], rect_points[3][1]);
					// endShape(CLOSE);
				}


    		// }
    }
   	fill(25, 0, 50, 1);
   	noStroke();
	textSize(14);
    text( slider_dict[category].value()/60+"min",slider_dict[category].position()['x']+135, slider_dict[category].position()['y']+10);


	fill(255);
	textFont(plainFont);
}


function centroid_hover(pointXY,radius,pop,walking){
	if (mouseX >= pointXY[0]-radius && mouseX <= pointXY[0]+radius && mouseY >= pointXY[1]-radius && mouseY <= pointXY[1]+radius){
		fill(25, 0, 100, 0.8);
		noStroke();
		rect(mouseX+4, mouseY-50, 130, 35);
		fill(25, 0, 0, 1);
		stroke(255);
		strokeWeight(3);
		textSize(13);
		text("no. of people: " + round(pop).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), mouseX+7, mouseY-35);
		text("avg. walking time: " + round(walking/60) + " min", mouseX+7, mouseY-20);
	}
}



function legend_draw(leged_dict){
	
	for (var i = 0; i < Object.keys(leged_dict).length; i++){
		button = createButton(Object.keys(leged_dict)[i]);
		button.position(legend_x-2, legend_y-30 + i*legend_space);
		button.style('font-family: "Roboto"; font-style: "lighter"; font-size: 15px; border:none; background-color:white;')

		button.mousePressed(filterDataClick);
		button_dict[Object.keys(legend_dict)[i]] = button;
	}
}


function slider_draw(legend_dict){

	for (var i = 0; i < Object.keys(legend_dict).length; i++){
		var category_max = legend_dict[Object.keys(legend_dict)[i]];
		// console.log(category_max)
		key_slider = createSlider(0, category_max[0],10*60,60);
		key_slider.position(legend_x+120, legend_y-30 + i*legend_space)
		key_slider.hide();
		slider_dict[Object.keys(legend_dict)[i]] = key_slider;

	}
	slider_dict[default_category].show();
   	button_dict[default_category].addClass("cat_selected");

}


function filterDataClick(event){
	// console.log(event.target.textContent,slider_dict,button_dict)
	filterData(event.target.textContent);
	
	for (var i = 0; i < Object.keys(slider_dict).length; i++){
		slider_dict[Object.keys(slider_dict)[i]].hide();
	}
	for (var i = 0; i < Object.keys(button_dict).length; i++){
		button_dict[Object.keys(button_dict)[i]].removeClass("cat_selected");
	}
	slider_dict[event.target.textContent].show();
	button_dict[event.target.textContent].addClass("cat_selected");
}

function filterData(category){

	data_list = [];
	// console.log("so", data_list)
	var filtered_data = dataTable.findRows(category, "category");
	data_list.push(filtered_data);
	// console.log(data_list)
}




function legend(maxtable){
	var maxValues_lookup = {};
	for (var i=0; i < maxtable.getRowCount(); i++){
		var category = maxtable.getString(i,0);
		var max_time = maxtable.getString(i,1);
		var max_distance = maxtable.getString(i,2);
		maxValues_lookup[category] = [max_time, max_distance];
	}
	return maxValues_lookup
}


function projectedPoints(cords){
var listPoints = [];	
	for (var i = 0; i < cords.length ; i++) {
		//console.log(group[i].arr)
		var pointLat = cords[i].arr[2]
		var pointLon = cords[i].arr[1]

		var projectedPoint = projectMercator(pointLon,pointLat);
		
		var x = map(projectedPoint.x, projected_t_l.x, projected_b_r.x, 0, 0.7*window.innerWidth);
    	var y = map(projectedPoint.y, projected_b_r.y, projected_t_l.y, 0, 0.7*0.707*window.innerWidth);
    	listPoints.push([x,y]);
	}
	return listPoints
}


function projectMercator(lon, lat) {
  return { 
    'x': lon, 
    'y': degrees(log(tan(radians(lat)) + 1.0/cos(radians(lat)))) 
  };
}
