google.maps.event.addDomListener(window, 'load', initmap);

  var map;
  var infobox;
  var allMarkers = [];
  var directionsService = new google.maps.DirectionsService();
  var directionDisplay = new google.maps.DirectionsRenderer();

  function initmap() {

    var mapOptions = {
      center :{
        lat: -41.279214,
        lng: 174.780340
      },
      zoom: 12,
      disableDefaultUI: true,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.LEFT_CENTER,
        mapTypeIds: ['roadmap', 'terrain']
      },
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      }
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionDisplay.setMap(map);
    directionDisplay.setPanel(document.getElementById('directions'));
    addAllMarkers();
  }

  function addAllMarkers(){
    $.ajax({
      url: 'data/marker.json',
      dataType: 'json',
      type: 'GET',
      success: function(markers){
        // console.log(markers);
        for (var i = 0; i < markers.length; i++) {
          $("#place").append(
            "<div class='place' data-id='"+markers[i].id+"'>"+
              "<h3>"+markers[i].place_name+"</h3>"+
              "<div class='panel'>"+
                "<p>"+markers[i].description+"</p><br>"+
                "<p>COST:</p>"+
              "</div>"+
            "</div>"+
            "<hr"
          );

          //Create drop markers on map for each place//
          var marker = new google.maps.Marker({
            position: {
              lat: markers[i].lat,
              lng: markers[i].lng
            },
            title: markers[i].place_name,
            markerID: markers[i].id,
            description: markers[i].description,
            lat: markers[i].lat,
            lng: markers[i].lng,
            map: map,
            animation: google.maps.Animation.DROP
          });
          allMarkers.push(marker);
          // console.log(allMarkers);
        }
        markerClickEvent(marker);

      },
      error: function(error){
        console.log("Something went wrong");
        console.log(error);
      }
    });
  }

  function markerClickEvent(marker){
    if(infobox){
      infobox.close();
    }
    infobox = new google.maps.InfoWindow();
    map.panTo(marker.position);
    google.maps.event.addListener(marker, 'click', function(){
      infobox.setContent(
        "div class='infobox'>"+
          '<strong>'+marker.title+'</strong><br>'+
          marker.description+'<br>'+
        '</div>');
      infobox.open(map, marker);
    });
  }

  function moveMap(){
    var latlng = new google.maps.LatLng(-41.2959299, 174.772154);
    map.panTo(latlng);
    map.setZoom(17);
  }

  function calcRoute(x, y){
    start = new google.maps.LatLng(-41.2865, 174.7762);
    end = new google.maps.LatLng(x, y);
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response,status){
    if(status == google.maps.DirectionsStatus.OK){
      directionDisplay.setDirections(response);
      var route = response.routes[0];
      }
    })
  }

  $(document).on('click', '.place', function(){
    if(infobox){
      infobox.close();
    }
    var id = $(this).data('id');
    // console.log(id);
    // console.log(allMarkers);
    $('.panel').slideUp();
    $(this).find('.panel').slideDown()
    for (var i = 0; i < allMarkers.length; i++) {
      if(allMarkers[i].markerID == id){
        map.panTo(allMarkers[i].position);
        map.setZoom(17);
        infobox = new google.maps.InfoWindow();
        infobox.setContent(
          '<div class="infobox">'+
            '<strong>'+allMarkers[i].title+'</strong><br>'+
            allMarkers[i].description+'<br>'+
          '</div>');
        infobox.open(map, allMarkers[i]);
        calcRoute(allMarkers[i].lat, allMarkers[i].lng);
        break;
      }
    }
  });
