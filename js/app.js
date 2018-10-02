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
     address: museumItem.vicinity,
     position: museumItem.geometry.location,
     animation: google.maps.Animation.DROP,
   });

   // create content for each infoWindow
   var contentString = '<h5>'+ museumItem.name +'</h5>' + '<h6>'+ museumItem.vicinity + '</h6>'

    // bind marker to the museum
    museumItem.marker = marker

    // and open infowindow when clicked
    marker.addListener('click', function() {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 750);
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });
  });

    // create infoWindow for museum marker
    var infoWindow = new google.maps.InfoWindow({
      content: self.contentString
    });

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
