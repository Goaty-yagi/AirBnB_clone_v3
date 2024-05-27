$(document).ready(function () {
  console.log("READY");

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
    console.log("list:", amenitiesList);
    $(".amenitie_list").text(amenitiesList);
    console.log($(".amenitie_list")[0].offsetHeight);
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
