$(document).ready(function () {
  let selectedAmenities = [];
  async function getUser(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://0.0.0.0:5001/api/v1/users/${id}`,
        type: "GET",
        contentType: "application/json",
        success: function (data) {
          resolve(data);
        },
        error: function () {
          reject(new Error("couldn't get user data"));
        }
      });
    });
  }

  async function getAmenities(place_id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://0.0.0.0:5001/api/v1/places/${place_id}/amenities`,
        type: "GET",
        contentType: "application/json",
        success: function (data) {
          resolve(data);
        },
        error: function () {
          reject(new Error("couldn't get amenities data"));
        }
      });
    });
  }

  async function hasAmenityByPlace(place_id) {
    try {
      const data = await getAmenities(place_id);
      return data.some((amenity) => amenity.id in selectedAmenities);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function placesSearch() {
    try {
      const data = await $.ajax({
        url: "http://0.0.0.0:5001/api/v1/places_search/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({})
      });

      $('section.places').empty();
      for (const place of data) {
        if (await hasAmenityByPlace(place.id)) {
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
          const userData = await getUser(place.user_id);
          user.append(owner).append(` ${userData.first_name} ${userData.last_name}`);

          const description = $('<div>').addClass('description').html(place.description);

          article.append(titleBox, information, user, description);

          $('section.places').append(article);
        }
      }
    } catch (error) {
      console.error(error);
      $("#api_status").removeClass("available");
    }
  }

  $('button').click(async () => {
    $('input[name="amenity"]:checked').each(function () {
      let amenityId = $(this).data('id');
      selectedAmenities.push(amenityId);
    });

    await placesSearch();
  });

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
