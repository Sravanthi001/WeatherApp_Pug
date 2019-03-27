$(document).ready(function() {
  $(".delete").on("click", function(e) {
    $target = $(e.target);
    const id = $target.attr("linkid");
    $.ajax({
      type: "DELETE",
      url: "weather" + "/" + id,
      success: function(response) {
        alert("deleting city");
        window.location.href = "weather";
      },
      error: function(err) {
        console.log("in err jqery", err);
      }
    });
  });
});
