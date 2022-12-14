var home = document.getElementById('home')
var locate = document.getElementById('locate')
var divs = document.getElementsByTagName('div')
var select = document.getElementById('filters')
var clearFilterBtn = document.getElementById('clear-filter')


Array.from(divs).forEach((div) =>{
 div.style.pointerEvents = "auto"
})


var map = L.map('map').setView([22.4999, 88.3711], 15)
var scale = L.control.scale({maxwidth: 100, metric:true})
scale.addTo(map)

var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'})
osmLayer.addTo(map)

var googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{attribution: '<a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>'})
googleSatellite.addTo(map)


var boundary = new L.GeoJSON.AJAX('data/boundary.geojson',{
    style:{color:'red'},
    fillOpacity:0
})
boundary.addTo(map)

function buildingstyle(feature) {
    return {
        fillColor: '#d5b43c', 
        fillOpacity: 1,
        color: '#d5b43c'
    };
}

var highlight = {
    'fillColor': 'yellow',
    'weight': 2,
    'opacity': 1
};

var building = new L.GeoJSON.AJAX('data/building.geojson',{
    style:buildingstyle(),
    onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.photo
        var name = feature.properties.name
        if (feature.properties.photo != null){
            layer.bindPopup(`<div><img class="buildingphotos" src=${src}><p><b>Name:</b> ${name}</p></div> `)
        }
        else{
            layer.bindPopup(`<div><p><b>Name:</b> ${name}</p></div>`)
        }
        layer.on('click',function(e){
            building.setStyle(buildingstyle)
            layer.setStyle(highlight)

        })
    }
})



L.control.search({
    layer: building,
    intial: false,
    propertyName: 'name'
}).addTo(map)
building.addTo(map)

var parking = new L.GeoJSON.AJAX('data/parking.geojson',{
    style:{color:'808080'},
    fillColor:'#808080',
    fillOpacity:1,
    onEachFeature:function(feature,layer){
        var popupContent = document.createElement('img')
        popupContent.setAttribute("class","parkingphotos")
        popupContent.src = "images/"+feature.properties.photo
        layer.bindPopup(popupContent)
    }
}) 
parking.addTo(map)

var playground = new L.GeoJSON.AJAX('data/playground.geojson',{
    style:{color:'#4daf4a'},
    fillOpacity:1,
    onEachFeature:function(feature,layer){
        var popupContent = document.createElement('img')
        popupContent.setAttribute("class","playgroundphotos")
        popupContent.src = "images/"+feature.properties.Photo
        if(feature.properties.Photo != null ){
            layer.bindPopup(popupContent)}
        
    }
})
playground.addTo(map)

var road = new L.GeoJSON.AJAX('data/Road.geojson',{
    style:{color:'rgba(255,127,0,1.0)'},
    fillOpacity: 1
})
road.addTo(map)

var roadcentre = new L.GeoJSON.AJAX('data/RoadCentreLine.geojson',{
    style:{color:"black",
    dashArray: '10,10'}
})
roadcentre.addTo(map)

var vegetationStripes = new L.StripePattern({color:'green'}); 
vegetationStripes.addTo(map);

var vegetation = new L.GeoJSON.AJAX('data/vegetation.geojson',{
    style:{color:'rgba(253,191,111,1.0)'},
    fillPattern: vegetationStripes,
    fillOpacity:1
}
)
vegetation.addTo(map)

var waterbody = new L.GeoJSON.AJAX('data/waterbody.geojson',{
    style:{color:'blue'},
    fillColor:'#48a9f2',
    fillOpacity:1,
    onEachFeature:function(feature,layer){
        var popupContent = document.createElement('img')
        popupContent.setAttribute("class","waterbodyphotos")
        popupContent.src = "images/"+feature.properties.Photo
        if(feature.properties.Photo != null ){
        layer.bindPopup(popupContent)}
    }
})
waterbody.addTo(map)



/* Not used
var POI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng)
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}
})
//POI.addTo(map)
*/

var buildingIcon = L.AwesomeMarkers.icon({
    icon: 'fa fa-building icon-white',
    prefix:'fa',
    markerColor: 'cadetblue',
    iconColor:'black'
  });

var buildingPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:buildingIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    
    return feature.properties.Type == 'Building'
}
})

var atmPOIIcon = L.AwesomeMarkers.icon({
    icon: 'fa fa-inr',
    prefix:'fa',
    markerColor: 'blue'
  });

var atmPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:atmPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'ATM'
}
})

var auditoriumPOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-sharp fa-solid fa-meteor",
    prefix:'fa',
    markerColor: 'black',
    iconColor:'white'

  });

var auditoriumPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:auditoriumPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Auditorium'
}
})

bridgePOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-solid fa-bridge-water",
    prefix:'fa',
    markerColor: 'white',
    iconColor:'black'

  });

var bridgePOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:bridgePOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Bridge'
}
})

var canteenPOIIcon = L.AwesomeMarkers.icon({
    icon: 'fa fa-cutlery',
    prefix:'fa',
    markerColor: 'purple',
    iconColor:'white'

  });

var canteenPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:canteenPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Canteen'
}
})

var gatePOIIcon = L.AwesomeMarkers.icon({
    icon: 'fa-solid fa-torii-gate',
    prefix:'fa',
    markerColor: 'white',
    iconColor:'black'
  });

var gatePOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:gatePOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Gate'
}
})

var healthcarePOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-solid fa-briefcase-medical",
    prefix:'fa',
    markerColor: 'white',
    iconColor:'red'

  });

var healthcarePOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:healthcarePOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'HealthCare'
}
})

var hostelPOIIcon = L.AwesomeMarkers.icon({
    icon: 'fa-solid fa-bed',
    prefix:'fa',
    markerColor: 'white',
    iconColor:'black'

  });

var hostelPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:hostelPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Hostel'
}
})

var lamppostPOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-solid fa-lightbulb",
    prefix:'fa',
    markerColor: 'cadetblue',
    iconColor:'white'

  });

var lamppostPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:lamppostPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'LampPost'
}
})

var libraryPOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-solid fa-book",
    prefix:'fa',
    markerColor: 'white',
    iconColor:'black'

  });

var libraryPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:libraryPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Library'
}
})

var parkPOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-solid fa-tree",
    prefix:'fa',
    markerColor: 'white',
    iconColor:'green'

  });

var parkPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:parkPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Park'
}
})

var playgroundPOIIcon = L.AwesomeMarkers.icon({
    icon: 'fa fa-futbol',
    prefix:'fa',
    markerColor: 'white',
    iconColor:'blue'

  });

var playgroundPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:playgroundPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Playground'
}
})

var pondPOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-solid fa-water",
    prefix:'fa',
    markerColor: 'white',
    iconColor:'blue'

  });

var pondPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:pondPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Pond'
}
})

var staffquarterPOIIcon = L.AwesomeMarkers.icon({
    icon: "home",
    prefix:'fa',
    markerColor: 'blue',
    iconColor:'black'

  });

var staffquarterPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:staffquarterPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'StaffQuarter'
}
})

var stationaryshopPOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-solid fa-shop",
    prefix:'fa',
    markerColor: 'blue',
    iconColor:'yellow'

  });

var stationaryshopPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:stationaryshopPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'StationaryShop'
}
})

var tapPOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-solid fa-droplet",
    prefix:'fa',
    markerColor: 'white',
    iconColor:'blue'

  });

var tapPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:tapPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Tap'
}
})

var templePOIIcon = L.AwesomeMarkers.icon({
    icon: 'fa fa-om',
    prefix:'fa',
    markerColor: 'blue',
    iconColor:'white'

  });

var templePOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:templePOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Temple'
}
})

var othersPOIIcon = L.AwesomeMarkers.icon({
    icon: "fa-solid fa-asterisk",
    prefix:'fa',
    markerColor: 'blue',
    iconColor:'yellow'

  });

var othersPOI = new L.GeoJSON.AJAX('data/POI.geojson',{
    pointToLayer:function(geoJsonPoint, latlng){
        return L.marker(latlng,{icon:othersPOIIcon})
    },onEachFeature:function(feature,layer){
        var src = "images/"+feature.properties.Photo
        var description = feature.properties.Description
        var surveyDate = feature.properties.Survey_Date
        var surveyor = feature.properties.Surveryor_Name
        var type = feature.properties.Type
        layer.bindPopup(`<div><img class="POIphotos" src=${src}><p><b>Survey Date:</b> ${surveyDate}<br><b>Surveyor Name:</b> ${surveyor}<br><b>Type:</b> ${type}<br><b> Description:</b> ${description}</p></div>`)
}, filter: function(feature,layer){
    return feature.properties.Type == 'Others'
}
})



var layerGroup = new L.layerGroup([atmPOI,auditoriumPOI,bridgePOI,canteenPOI,gatePOI,healthcarePOI,hostelPOI,lamppostPOI,libraryPOI,parkPOI,playgroundPOI,staffquarterPOI,stationaryshopPOI,tapPOI,templePOI,othersPOI]).addTo(map)

   
select.addEventListener('click',function(){
    if (select.value == 'Building'){
        layerGroup.clearLayers()
        buildingPOI.addTo(layerGroup)
    }
    else if (select.value == 'Hostel'){
        layerGroup.clearLayers()
        hostelPOI.addTo(layerGroup)
    }
    else if (select.value == 'HealthCare'){
        layerGroup.clearLayers()
        healthcarePOI.addTo(layerGroup)
    }
    else if (select.value == 'Gate'){
        layerGroup.clearLayers()
        gatePOI.addTo(layerGroup)
    }
    else if (select.value == 'LampPost'){
        layerGroup.clearLayers()
        lamppostPOI.addTo(layerGroup)
    }
    else if (select.value == 'Others'){
        layerGroup.clearLayers()
        othersPOI.addTo(layerGroup)
    }
    else if (select.value == 'ATM'){
        layerGroup.clearLayers()
        atmPOI.addTo(layerGroup)
    }
    else if (select.value == 'Auditorium'){
        layerGroup.clearLayers()
        auditoriumPOI.addTo(layerGroup)
    }
    else if (select.value == 'Bridge'){
        layerGroup.clearLayers()
        bridgePOI.addTo(layerGroup)
    }
    else if (select.value == 'Canteen'){
        layerGroup.clearLayers()
        canteenPOI.addTo(layerGroup)
    }
    else if (select.value == 'Library'){
        layerGroup.clearLayers()
        libraryPOI.addTo(layerGroup)
    }
    else if (select.value == 'Park'){
        layerGroup.clearLayers()
        parkPOI.addTo(layerGroup)
    }
    else if (select.value == 'Playground'){
        layerGroup.clearLayers()
        playgroundPOI.addTo(layerGroup)
    }
    else if (select.value == 'Pond'){
        layerGroup.clearLayers()
        pondPOI.addTo(layerGroup)
    }
    else if (select.value == 'StaffQuarter'){
        layerGroup.clearLayers()
        staffquarterPOI.addTo(layerGroup)
    }
    else if (select.value == 'StationaryShop'){
        layerGroup.clearLayers()
        stationaryshopPOI.addTo(layerGroup)
    }
    else if (select.value == 'Tap'){
        layerGroup.clearLayers()
        tapPOI.addTo(layerGroup)
    }
    else if (select.value == 'Temple'){
        layerGroup.clearLayers()
        templePOI.addTo(layerGroup)
    }
    
})

clearFilterBtn.addEventListener('click',function(){
    atmPOI.addTo(layerGroup)
    auditoriumPOI.addTo(layerGroup)
    //buildingPOI.addTo(layerGroup)
    bridgePOI.addTo(layerGroup)
    canteenPOI.addTo(layerGroup)
    gatePOI.addTo(layerGroup)
    healthcarePOI.addTo(layerGroup)
    hostelPOI.addTo(layerGroup)
    lamppostPOI.addTo(layerGroup)
    libraryPOI.addTo(layerGroup)
    parkPOI.addTo(layerGroup)
    playgroundPOI.addTo(layerGroup)
    //pondPOI.addTo(layerGroup)
    staffquarterPOI.addTo(layerGroup)
    stationaryshopPOI.addTo(layerGroup)
    tapPOI.addTo(layerGroup)
    templePOI.addTo(layerGroup)
    othersPOI.addTo(layerGroup)

})





var basemaps = {
    "OpenStreetMap" : osmLayer,
    "Google Satellite" : googleSatellite
} 

var overlayMaps = {
    'POI' : layerGroup,
    '<img src="images/legend/Building.png">Building': building,
    '<img src="images/legend/RoadCentralLine.png">Road Centre Line' : roadcentre,
    '<img src="images/legend/Roads.png">Road': road,
    '<img src="images/legend/Vegetation.png">Vegetation' : vegetation,
    '<img src="images/legend/Waterbody.png">Waterbody' : waterbody,
    '<img src="images/legend/playground.png">Playground' : playground,
    '<img src="images/legend/Parking.png">Parking':parking,
    '<img src="images/legend/Boundary.png">JU Campus Boundary' : boundary


}

 

//Adding Layer Control for Basemap and Overlay
var layerControl = L.control.layers(basemaps, overlayMaps)
layerControl.addTo(map)

home.addEventListener('click',function(){
     var homeLocation = map.setView(new L.LatLng(22.4999, 88.3711),15)
     homeLocation.addTo(map)
     
})

var userLocationIcon =  L.icon({
    iconUrl: 'marker/LocationSymbol.png'})

function onLocationFound(e){
    var radius = e.accuracy
    radius2 = radius.toFixed(0)
    L.marker(e.latlng,{icon:userLocationIcon}).bindPopup("You are within "+ radius2 +" meters from this point").addTo(map).openPopup()
    //L.circle(e.latlng,radius).addTo(map)
}
function onLocationError(e){
    alert(e.message)
}

locate.addEventListener('click',function(){
    map.locate({setView:true})
    map.on('locationfound',onLocationFound)
    map.on("locationerror", onLocationError)
})

var search = new L.control.search({
    layer: building,
    intial:false,
    propertyName: 'name'
})

L.easyPrint({
    title:'Download The Map',
    position:'bottomleft',
    sizeModes:['Current','A4Portrait','A4Landscape'],
    exportOnly:true,
    filename:'map'
}).addTo(map)

L.control.polylineMeasure({position:'topright'}).addTo(map)

var osm2 = new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 0, maxZoom: 13, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
var miniMap = new L.Control.MiniMap(osm2,{toggleDisplay:true,minimized:true}).addTo(map);

