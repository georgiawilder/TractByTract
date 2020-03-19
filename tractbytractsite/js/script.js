console.log("staging"); 
var mapStyle = [
  { "elementType": "geometry",
      "stylers": [{"color": "#f5f5f5"}]
  },
  { "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
  },
  { "elementType": "labels.text.fill",
      "stylers": [{"color": "#616161"}]
  },
  { "elementType": "labels.text.stroke",
      "stylers": [{"color": "#f5f5f5"}]
  },
  { "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [{"visibility": "off"}]
  },
  { "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#bdbdbd"}]
  },
  { "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{"color": "#eeeeee"}]
  },
  { "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#757575"}]
  },
  { "featureType": "poi.business",
      "stylers": [{"visibility": "off"}]
  },
  { "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{"color": "#e5e5e5"}]
  },
  { "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [{"visibility": "off"}]
  },
  { "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#9e9e9e"}]
  },
  { "featureType": "road",
      "elementType": "geometry",
      "stylers": [{"color": "#ffffff"}]
  },
  { "featureType": "road.arterial",
      "stylers": [{"visibility": "off"}]
  },
  { "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#757575"}]
  },
  { "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{"color": "#dadada"}]
  },
  { "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [{"visibility": "off"}]
  },
  { "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#616161"}]
  },
  { "featureType": "road.local",
      "stylers": [{"visibility": "off"}]
  },
  { "featureType": "road.local",
      "elementType": "labels",
      "stylers": [{"visibility": "off"}]
  },
  { "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#9e9e9e"}]
  },
  { "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [{"color": "#e5e5e5"}]
  },
  { "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{"color": "#eeeeee"}]
  },
  { "featureType": "water",
      "elementType": "geometry",
      "stylers": [{"color": "#c9c9c9"}]
  },
  { "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#9e9e9e"}]
  }
  ];
var map;
var tractLayer;
var censusMin = Number.MAX_VALUE, censusMax = -Number.MAX_VALUE;
var month;
var day;
var year;
var date;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var states=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

var states_geocode={"Alabama":[32.806671,-86.791130],"Alaska":[61.370716,-152.404419],"Arizona":[33.729759,-111.431221],"Arkansas":[34.969704,-92.373123],"California":[36.116203,-119.681564],"Colorado":[39.059811,-105.311104],"Connecticut":[41.597782,-72.755371],"Delaware":[39.318523,-75.507141],"Florida":[27.766279,-81.686783],"Georgia":[33.040619,-83.643074],"Hawaii":[21.094318,-157.498337],"Idaho":[44.240459,-114.478828],"Illinois":[40.349457,-88.986137],"Indiana":[39.849426,-86.258278],"Iowa":[42.011539,-93.210526],"Kansas":[38.526600,-96.726486],"Kentucky":[37.668140,-84.670067],"Louisiana":[31.169546,-91.867805],"Maine":[44.693947,-69.381927],"Maryland":[39.063946,-76.802101],"Massachusetts":[42.230171,-71.530106],"Michigan":[43.326618,-84.536095],"Minnesota":[45.694454,-93.900192],"Mississippi":[32.741646,-89.678696],"Missouri":[38.456085,-92.288368],"Montana":[46.921925,-110.454353],"Nebraska":[41.125370,-98.268082],"Nevada":[38.313515,-117.055374],"New Hampshire":[43.452492,-71.563896],"New Jersey":[40.298904,-74.521011],"New Mexico":[34.840515,-106.248482],"New York":[42.165726,-74.948051],"North Carolina":[35.630066,-79.806419],"North Dakota":[47.528912,-99.784012],"Ohio":[40.388783,-82.764915],"Oklahoma":[35.565342,-96.928917],"Oregon":[44.572021,-122.070938],"Pennsylvania":[40.590752,-77.209755],"Rhode Island":[41.680893,-71.511780],"South Carolina":[33.856892,-80.945007],"South Dakota":[44.299782,-99.438828],"Tennessee":[35.747845,-86.692345],"Texas":[31.054487,-97.563461],"Utah":[40.150032,-111.862434],"Vermont":[44.045876,-72.710686],"Virginia":[37.769337,-78.169968],"Washington":[47.400902,-121.490494],"West Virginia":[38.491226,-80.954453],"Wisconsin":[44.268543,-89.616508],"Wyoming":[42.755966,-107.302490]};


var state_codes={"Alabama":"01","Alaska":"02","Arizona":"04","Arkansas":"05","California":"06","Colorado":"08","Connecticut":"09","Delaware":"10","Florida":"12","Georgia":"13","Hawaii":"15","Idaho":"16","Illinois":"17","Indiana":"18","Iowa":"19","Kansas":"20","Kentucky":"21","Louisiana":"22","Maine":"23","Maryland":"24","Massachusetts":"25","Michigan":"26","Minnesota":"27","Mississippi":"28","Missouri":"29","Montana":"30","Nebraska":"31","Nevada":"32","New Hampshire":"33","New Jersey":"34","New Mexico":"35","New York":"36","North Carolina":"37","North Dakota":"38","Ohio":"39","Oklahoma":"40","Oregon":"41","Pennsylvania":"42","Rhode Island":"44","South Carolina":"45","South Dakota":"46","Tennessee":"47","Texas":"48","Utah":"49","Vermont":"50","Virginia":"51","Washington":"53","West Virginia":"54","Wisconsin":"55","Wyoming":"56"};

//const STATES = ["36","09","34"];
//const STATES = ["36"];

function initMap() {
  // load the map of NYC
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7606809, lng: -73.9231722},
    zoom: 10,
    styles: mapStyle,
    scrollwheel: false
  });

  //Add state borders
  var stateLayer = new google.maps.Data();
  //var state_geojson_file = 'https://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_500k.json';
  //state_geojson_file.setHeader('Access-Control-Allow-Origin', '*');
  stateLayer.loadGeoJson('https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/500k/2017/state.json'); 
  stateLayer.setStyle(function(feature){
    return ({
      fillOpacity: 0.0,
      strokeWeight: 2
    });
  });
  stateLayer.setMap(map);


  // Set the date to today's date
  d = new Date();
  month = monthNames[d.getMonth()];
  day = d.getDate();
  year = d.getFullYear();

  document.getElementById('data-value').textContent = "";
  //document.getElementById('data-box').style.display = 'block';
 
  tractLayer = new google.maps.Data();

  tractLayer.loadGeoJson('https://raw.githubusercontent.com/arcee123/GIS_GEOJSON_CENSUS_TRACTS/master/36.geojson',
    { idPropertyName: 'GEOID'});

  tractLayer.setMap(map);
 
  // Add styling to the map
  tractLayer.setStyle(mapStyle);
  
  tractLayer.setStyle(styleFeature);
  tractLayer.addListener('mouseover', mouseInToRegion);
  tractLayer.addListener('mouseout', mouseOutOfRegion);

  // census tract polygons only need to be loaded once, do them now
  loadMapShapes();

};

/**
 * * Applies a gradient style based on the 'census_variable' column.
 * * This is the callback passed to data.setStyle() and is called for each row in
 * * the data set.  Check out the docs for Data.StylingFunction.
 * *
 * * @param {google.maps.Data.Feature} feature
 * */

function styleFeature(feature) {
  var low = [5, 69, 54];  // color of smallest datum
  var high = [151, 83, 34];   // color of largest datum

  // delta represents where the value sits between the min and max
   var delta = (feature.getProperty('census_variable') - censusMin) /
      (censusMax - censusMin);

  var color = [];
  for (var i = 0; i < 3; i++) {
    // calculate an integer color based on the delta
    color[i] = (high[i] - low[i]) * delta + low[i];
  }

  // determine whether to show this shape or not
  var showRow = true;
  if (feature.getProperty('census_variable') == null ||
      isNaN(feature.getProperty('census_variable'))) {
    showRow = false;
  }

  var outlineWeight = 0.5, zIndex = 1;
  if (feature.getProperty('state') === 'hover') {
    outlineWeight = zIndex = 2;
  }

  return {
    strokeWeight: outlineWeight,
    strokeColor: '#fff',
    zIndex: zIndex,
    fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
    fillOpacity: 0.75,
    visible: showRow
  };
}

function getBorough(county){
  var borough = county;
  if (county == "061"){
    // Manhattan / New York County
    borough = "1";
  } 
  else if (county == "047"){
    // Brooklyn / Kings County
    borough = "3";
  }
  else if (county == "005"){
    // Bronx County
    borough = "2";
  }
  else if (county == "085"){
    // Staten Island / Richmond County
    borough = "5";
  }
  else if (county == "081"){
    // Queens County 081
    borough = "4";
  }

  return borough;
}

/**
 * Loads the census data from a simulated API call to the US Census API.
 *
 * @param {string} variable
 */
function loadCensusData(address) {
  // load the requested variable from the census API (using local copies)
  var xhr = new XMLHttpRequest();
  xhr.open('GET', address);
  xhr.onload = function() {
    var censusData = JSON.parse(xhr.response);
    
    censusData.forEach(function(row) {
      var censusVariable = Math.round(parseFloat(row['prediction']));
      var geoID = row['GeoID'];

      var borocode = getBorough(row['Borocode']);
      var CT2010 = geoID.substring(5,11);

      //identify borough using county
      //var id =  borocode + CT2010;
      var id=geoID;
      if (id.length == 10) {        
         id = "0" + geoID;
      }
      console.log(id)
      try {
	tractLayer
        .getFeatureById(id)
        .setProperty('census_variable', censusVariable);
      } catch (error) {
        //console.log(id);
      } 

    });

    
    //var original = 'https://storage.googleapis.com/www.census2020map.com/orig_36.json';
    //var original = 'https://census-260518.appspot.com/'
    loadOriginalData(address);

  };
  xhr.send();

}

/**
 * Loads the census data from a simulated API call to the US Census API.
 *
 * @param {string} variable
 */
 function loadOriginalData(address) {
  // load the requested variable from the census API (using local copies)
  var xhr = new XMLHttpRequest();
  xhr.open('GET', address);
  xhr.send();
  xhr.onload = function() {
    var censusData = JSON.parse(xhr.response);

    censusData.forEach(function(row) {
      var censusVariable = parseFloat(row['orig']);
      var geoID = row['GeoID'];

      var borocode = getBorough(row['Borocode']);
      var CT2010 = geoID.substring(5,11);
	
      //var id = borocode + CT2010; 
      var id=geoID;
      if (id.length == 10) {
         id = "0" + geoID;
      }
      try {
        var currentVariable = tractLayer
          .getFeatureById(id)
          .getProperty('census_variable');
	
//       console.log(currentVariable, censusVariable);

        censusVariable = (censusVariable/currentVariable)*100;
        censusVariable = Math.round(parseFloat(censusVariable*100))/100;


        tractLayer
        .getFeatureById(id)
        .setProperty('census_variable', censusVariable);

        // keep track of min and max values
        if (censusVariable < censusMin) {
          censusMin = censusVariable;
        }
        if (censusVariable > censusMax) {
          censusMax = censusVariable;
          console.log('Updating censusMax to: ', censusMax, ' because ', geoID, ' has ', censusVariable, 'as rate');
        }
      } catch (error) {
        //console.log(id);
      } 

      

    });


    // update and display the legend
    document.getElementById('census-min').textContent =
        censusMin.toLocaleString();
    document.getElementById('census-max').textContent =
        censusMax.toLocaleString();

  };
  

}

  /**
 * Responds to the mouse-in event on a map shape (state).
 *
 * @param {?google.maps.MouseEvent} e
 */
function mouseInToRegion(e) {
  // set the hover state so the setStyle function can change the border
  e.feature.setProperty('state', 'hover');

  // update the label
  var percent = (e.feature.getProperty('census_variable') - censusMin) /
      (censusMax - censusMin) * 100;

 // update the label
 document.getElementById('data-label').textContent = "County " +
      e.feature.getProperty('COUNTYFP') + ", " + e.feature.getProperty('NAMELSAD');
  document.getElementById('data-value').textContent =
      e.feature.getProperty('census_variable') + '%';
  document.getElementById('data-box').style.display = 'block';
  document.getElementById('data-caret').style.display = 'block';
  document.getElementById('data-caret').style.paddingLeft = percent + '%';
}

/**
 * Responds to the mouse-out event on a map shape (state).
 *
 * @param {?google.maps.MouseEvent} e
 */
 function mouseOutOfRegion(e) {
  // reset the hover state, returning the border to normal
  e.feature.setProperty('state', 'normal');
}

function getRndInteger(min=-100, max=100) {
  return Math.floor(Math.random() * (max - min)) + min;
}   

/** Loads the state boundary polygons from a GeoJSON source. */
function loadMapShapes() {

  console.log("load map shapes");
  // load US state outline polygons from a GeoJson file
  //map.data.loadGeoJson('https://opendata.arcgis.com/datasets/5e1d9acbb2d4490795c48f1b03f7f730_0.geojson', 
    //{ idPropertyName: 'BoroCT2010' });
 
  /**tractLayer = new google.maps.Data();
 
  tractLayer.loadGeoJson('https://raw.githubusercontent.com/arcee123/GIS_GEOJSON_CENSUS_TRACTS/master/36.geojson', 
    { idPropertyName: 'GEOID'});

  tractLayer.setMap(map);
  **/

  // wait for the request to complete by listening for the first feature to be
  // added
  google.maps.event.addListenerOnce(tractLayer, 'addfeature', function() {
    //var prediction = 'https://storage.googleapis.com/www.census2020map.com/state_36.json';
//var prediction = 'https://20200312t140516-dot-census-260518.appspot.com/';     
	var prediction = 'https://census-260518.appspot.com/';
	loadCensusData(prediction);
  });

}


//loadMapShapes with arguments
function loadMapShapesByState(state_id) {
  console.log("load map shapes with arguments");

  var geojson_file = "https://raw.githubusercontent.com/arcee123/GIS_GEOJSON_CENSUS_TRACTS/master/"+state_id+".geojson";
  tractLayer.loadGeoJson(geojson_file, {idPropertyName: 'GEOID'});

  google.maps.event.addListenerOnce(tractLayer, 'addfeature', function() {
    var prediction = "https://census-260518.appspot.com/state="+state_id;
    loadCensusData(prediction);
  });
}

/**function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(document).ready(function() {
    
    $(window).scroll(function() {
	if isScrolledIntoView($("#map")) {
	    console.log("MAP IN VIEW:")
	    $("#map").css({'position':'fixed','top':'0px'});
	}
    });
});**/

$(document).ready(function() {

  var select = document.getElementById("selectState");
  for(var i = 0; i < states.length; i++) {
    var opt = states[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
  }

  $("#selectState").val("New York");
  $("#visibleStateList").append("<tr><td>"+$("#selectState").val()+"</td><td></td></tr>");
 // $("#visibleStateList").append("<tr><td>"+$("#selectState").val()+"</td><td><button id="+$("#selectState").val()+">&times</button></td></tr>");

  $("#selectState").change(function() {
    $("#visibleStateList").append("<tr><td>"+$("#selectState").val()+"</td><td></td></tr>");
    //$("#visibleStateList").append("<tr><td>"+$("#selectState").val()+"</td><td><button>&times</button></td></tr>");
    map.data.forEach(function(feature) {
      map.data.remove(feature);
    });


    var state = this.value;
    var state_lat = states_geocode[state][0];
    var state_lng = states_geocode[state][1];
   
    map.setCenter(new google.maps.LatLng(state_lat,state_lng));

    var s_id = state_codes[state];
    loadMapShapesByState(s_id);   

  });

  $("#clear_button").click(function() {
    /**var this_state = this.id;
    var i = this.parentNode.parentNode.rowIndex;
    document.getElementById("visibleStateList").deleteRow(i); 
    var this_state_id =  
    map.data.forEach(function(feature) {
      var this_id = state_codes[this_state];
      if (feature.getProperty(id).startsWith(this_id)) {
        map.data.remove(feature);
      }
    });**/
    tractLayer.forEach(function(feature) {
      tractLayer.remove(feature);
    });
    $("#visibleStateList").empty();
    $("#selectState").val("Select state");
  });
});


function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7606809, lng: -73.9231722},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
      
    searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

        
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  /**d = new Date();
  month = monthNames[d.getMonth()];
  day = d.getDate();
  year = d.getFullYear();

  document.getElementById('data-value').textContent = "";
  document.getElementById('data-box').style.display = 'block';
  
  // Add styling to the map
  map.data.setStyle(mapStyle);
  map.data.setStyle(styleFeature);
  map.data.addListener('mouseover', mouseInToRegion);
  map.data.addListener('mouseout', mouseOutOfRegion);
  
  // census tract polygons only need to be loaded once, do them now
  loadMapShapes();**/
  
}

