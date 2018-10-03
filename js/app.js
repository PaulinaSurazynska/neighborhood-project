var ViewModel = function(){
  var self = this;
  // create an observable for museum list
  self.museumList = ko.observableArray(museums);

  // show marker for the coresponding museumItem from the list
  this.showMarker = function(museumItem) {
    google.maps.event.trigger(this.marker, 'click');
  }

  // create museumItem for each museum from the array
  self.museumList().forEach(function(museumItem){

  // create a marker for each museum
  var marker = new google.maps.Marker({
    map: map,
    name: museumItem.name,
    position: museumItem.location,
    animation: google.maps.Animation.DROP,
  });

  // call foursquare for each museum
  getDataFromFoursquare(museumItem)

  // bind marker to the museum
  museumItem.marker = marker

  // and open infowindow when clicked
  marker.addListener('click', function() {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 750);
    infoWindow.setContent(museumItem.infoMarkerWindow);
    infoWindow.open(map, marker);
    });
  });

  // create infoWindow for museum marker
  var infoWindow = new google.maps.InfoWindow();

  // api request to foursquare
  function getDataFromFoursquare(museum){
    // define variables used in url HTTP request
    var urlBeginning = "https://api.foursquare.com/v2/venues/";
    var museumID = museum.id;
    var client_id = "?client_id=HPDRNOUEPAXSNMMECXU0FTUWLXVNKVQFG10BPBQ4F44ZWWR4&";
    var client_secret = "client_secret=EAX3GEJCFYYB3XSY43PDHIQW1XAWKE5UEELXI0QMRYPIDSY1&v=20181003";
    var v = "&v=20181003";

    var urlFull = urlBeginning + museumID + client_id + client_secret + v;

    // create request
    $.ajax({
      url: urlFull,
      success: function(response) {
        // get info from the response
        var name = response.response.venue.name
        var desc = response.response.venue.description;
        var address = response.response.venue.location.formattedAddress;
        var opening = response.response.venue.hours.status;
        var web = response.response.venue.url;

        museum.infoMarkerWindow =
          '<h5>'+ name + '</h5>' +
          '<p>' + desc + '</p>' +
          '<span>' + address + '</span>' +
          '<span>' + opening + '</span>' +
          '<a target="_blank">' + web + '</a>'
        },
        error: function() {
          museum.infoMarkerWindow = 'Something went wrong and we cannot load data from fourSquare';
        }
      });
    };

  // Create an observable for filter museum
  self.museumFilter = ko.observable("");

  // Create filter input function to update filter list
  self.museumFilterList = ko.computed(function() {
    return ko.utils.arrayFilter(self.museumList(), function(museum) {
      var visible = museum.name.toLowerCase().indexOf(self.museumFilter().toLowerCase()) != -1;
      if (visible) {
        museum.marker.setVisible(visible);
      } else {
        museum.marker.setVisible(false);
      }
      return visible;
    });
  });
}

// define global variables used within initMap function
var map;

// Google Maps Error Handling.
 function mapsErrorHandler() {
    alert("Something went wrong:( Could not load the map. Please refresh this page or try again later.");
}

// inistalize google map
function initMap() {
  // create a new map
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 51.519103, lng: -0.126345},
    zoom: 13
  });

  ko.applyBindings(new ViewModel());
}
