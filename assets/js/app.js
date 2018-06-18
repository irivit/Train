$(document).ready(() => {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDKSU0lLWbY-i3wECiIOhvC1VYMfTOf2Js",
    authDomain: "train-scheduler-f8054.firebaseapp.com",
    databaseURL: "https://train-scheduler-f8054.firebaseio.com",
    projectId: "train-scheduler-f8054",
    storageBucket: "",
    messagingSenderId: "863572831816"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var trainDestination = "";
  var frecuency = "";
  var firstTime = "";

  var next_Arrival = "";
  var minAway = "";


  function calculateTime(time, frec) {

    var firstTimeConverted = moment(time, "HH:mm").subtract(1, "years");
    var currentTime = moment();

    var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % frec;

    // Minute Until Train
    var tMinutesTillTrain = frec - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    next_Arrival = moment(nextTrain).format("hh:mm");

    minAway = tMinutesTillTrain;
  }


  function saveData() {

    calculateTime(firstTime, frecuency);

    database.ref().push({
      trainName: trainName,
      trainDestination: trainDestination,
      frecuency: frecuency,
      firstTime: firstTime,
      next_Arrival: next_Arrival,
      minAway: minAway
    });
  }


  $("#add-train").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();
    $("#errorMessage").text('');

    //Taking values from user

    trainName = $("#train-name-input").val().trim();
    trainDestination = $("#destination-input").val().trim();
    frecuency = $("#frecuency-input").val().trim();
    firstTime = $("#first-train-time-input").val().trim();

    if ((trainName === "") || (trainDestination === "") || (frecuency === "") || (firstTime === " ")) {
      $("#contentForm").prepend(`<p id="errorMessage">* You must to fill all the fields</p>`);
    } else {
      saveData();
    }
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frecuency-input").val("");
    $("#first-train-time-input").val("");


  });


  database.ref().on("child_added", function (snapshot) {

    $("#results").append(
      `<thead><tr id=${snapshot.key}><td for="trainName">` + snapshot.val().trainName + ` </td>
       <td for="TrainDestination"> `+ snapshot.val().trainDestination + `</td>
       <td for="frecuency">` + snapshot.val().frecuency + `</td>
       <td for="nextArrival">` + snapshot.val().next_Arrival + `</td>
       <td for ="minAway">` + snapshot.val().minAway + `</td>
       <td for ="delete"><button type="button" class="btn btn-default btn-sm" >
        <span class="glyphicon glyphicon-trash" id="remove"></span>
        </button> </td>
       </tr></thead>`);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });


  $(document).on('click', '#remove', function () {
    var rowId = $(this).parents('tr').attr('id');

    var row = $(this).closest('tr');
    row.remove();
    database.ref(rowId).remove();

  });


});
