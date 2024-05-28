$(document).ready(function () {
  console.log("READY");

  function placesSearch() {
    $.post("http://0.0.0.0:5001/api/v1/places_search/",
      contentType = 'application/json',
      data = JSON.stringify({}),
      function (data) {
        if (data.status === "OK") {
          data.forEach(place => {
            const article = $('<article>');
            
            const titleBox = $('<div>').addClass('title_box');
            const placeName = $('<h2>').text(place.name);
            const priceByNight = $('<div>').addClass('price_by_night').text(`$${place.price_by_night}`);
            titleBox.append(placeName, priceByNight);
    
            const information = $('<div>').addClass('information');
            const maxGuest = $('<div>').addClass('max_guest').text(`${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`);
            const numberRooms = $('<div>').addClass('number_rooms').text(`${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`);
            const numberBathrooms = $('<div>').addClass('number_bathrooms').text(`${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`);
            information.append(maxGuest, numberRooms, numberBathrooms);

            const user = $('<div>').addClass('user');
            const owner = $('<b>').text('Owner:');
            user.append(owner).text(`${ place.user.first_name } ${ place.user.last_name }`)
    
            const description = $('<div>').addClass('description').html(place.description);
    
            article.append(titleBox, information, user, description);
    
            $('section.places').append(article);
          });
        } else {
        }
      }).fail(function () {
        $("#api_status").removeClass("available");
      });
  }

  // Function to check API status
  function checkApiStatus() {
    $.get("http://localhost:5001/api/v1/status/", function (data) {
      if (data.status === "OK") {
        $("#api_status").addClass("available");
      } else {
        $("#api_status").removeClass("available");
      }
    }).fail(function () {
      $("#api_status").removeClass("available");
    });
  }

  checkApiStatus();

  const checkedAmenities = {};
  function updateAmenities() {
    const amenitiesList = Object.values(checkedAmenities).join(", ");
    $(".amenitie_list").text(amenitiesList);
  }
  $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).data("id");
    const amenityName = $(this).data("name");

    if ($(this).is(":checked")) {
      checkedAmenities[amenityId] = amenityName;
    } else {
      delete checkedAmenities[amenityId];
    }
    updateAmenities();
  });
});
