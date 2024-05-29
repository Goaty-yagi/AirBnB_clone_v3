$(document).ready(function () {

  async function getUser(id) {
    $.ajax({
      url: `http://0.0.0.0:5001/api/v1/users/${id}`,
      type: "GET",
      contentType: "application/json",
      data: JSON.stringify({}),
      success: function (data) {
        return data
      },
      error: function () {
        throw new Error("couldn't get user data")
      }
    });
  }

  function placesSearch() {
    $.ajax({
      url: "http://0.0.0.0:5001/api/v1/places_search/",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({}),
      success: function (data) {
        $('section.places').empty();
        data.forEach(place => {
          const article = $('<article>');
          getUser(place.user_id)
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
          const userData = getUser(place.user_id) // This is bad approach. Place data should includes user data
          user.append(owner).append(` ${userData.first_name} ${userData.last_name}`);
  
          const description = $('<div>').addClass('description').html(place.description);
  
          article.append(titleBox, information, user, description);
  
          $('section.places').append(article);
        });
      },
      error: function () {
        $("#api_status").removeClass("available");
      }
    });
  }
  
  $('button').click(placesSearch);
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
