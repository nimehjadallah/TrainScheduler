var config = {
    apiKey: "AIzaSyC4hgM79znkN1q6FtrzQ04v-XWijAT4V08",
    authDomain: "test-c8a67.firebaseapp.com",
    databaseURL: "https://test-c8a67.firebaseio.com",
    projectId: "test-c8a67",
    storageBucket: "test-c8a67.appspot.com",
    messagingSenderId: "534816952641"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;

function currentTime() {
  var current = moment().format('LT');
  $("#currentTime").html(current);
  setTimeout(currentTime, 1000);
};

$(".form-field").on("keyup", function() {
  var name = $("#trainName").val().trim();
  var city = $("#destination").val().trim();
  var time = $("#firstTrain").val().trim();
  var frequency = $("#frequency").val().trim();

  sessionStorage.setItem("train", name);
  sessionStorage.setItem("city", city);
  sessionStorage.setItem("time", time);
  sessionStorage.setItem("freq", frequency);
});

$("#trainName").val(sessionStorage.getItem("train"));
$("#destination").val(sessionStorage.getItem("city"));
$("#firstTrain").val(sessionStorage.getItem("time"));
$("#frequency").val(sessionStorage.getItem("freq"));

$("#submit").on("click", function(event) {
  event.preventDefault();

  if ($("#trainName").val().trim() === "" ||
    $("#destination").val().trim() === "" ||
    $("#firstTrain").val().trim() === "" ||
    $("#frequency").val().trim() === "") {

    alert("Please fill in all details to add new train");

  } else {

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();

    $(".form-field").val("");

    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      startTime: startTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    sessionStorage.clear();
  }

});

database.ref().on("child_added", function(childSnapshot) {
  var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
  var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
  var timeRemain = timeDiff % childSnapshot.val().frequency;
  var minToArrival = childSnapshot.val().frequency - timeRemain;
  var nextTrain = moment().add(minToArrival, "minutes");
  var key = childSnapshot.key;

  var newrow = $("<tr>");
  newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
  newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
  newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
  newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
  newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

  if (minToArrival < 6) {
    newrow.addClass("info");
  }

  $("#trainTableRows").append(newrow);

});

$(document).on("click", ".arrival", function() {
  keyref = $(this).attr("data-key");
  database.ref().child(keyref).remove();
  window.location.reload();
});

currentTime();

setInterval(function() {
  window.location.reload();
}, 60000);