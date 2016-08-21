var diseaseID = 586;
var request = $.ajax({
  url: "http://health.apmall.tw/sickness.php",
  method: "GET",
  data: { id : diseaseID },
  dataType: "json"
});
 
request.done(function( msg ) {
  console.log(msg.id);
  console.log(msg.symptom);
  console.log(msg.solution);
});
 
request.fail(function( jqXHR, textStatus ) {
  alert( "Request failed: " + textStatus );
});