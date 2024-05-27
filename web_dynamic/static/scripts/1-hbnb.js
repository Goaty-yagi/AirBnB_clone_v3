$(document).ready(function() {
  console.log("READY")
  const checkedAmenities = {};
  function updateAmenities() {
      const amenitiesList = Object.values(checkedAmenities).join(', ');
      console.log("list:", amenitiesList)
      $('.amenitie_list').text(amenitiesList);
      console.log($('.amenitie_list')[0].offsetHeight)
  }
  $('input[type="checkbox"]').change(function() {
      const amenityId = $(this).data('id');
      const amenityName = $(this).data('name');

      if ($(this).is(':checked')) {
          checkedAmenities[amenityId] = amenityName;
      } else {
          delete checkedAmenities[amenityId];
      }
      updateAmenities();
  });
});
