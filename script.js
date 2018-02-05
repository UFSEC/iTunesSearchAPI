// Makes an http request to the specified url and invokes the callback when the response is returned.
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText)
    }
    xmlHttp.open("GET", theUrl, true) // True for async
    xmlHttp.send(null); // null body in the request (our query params are in the url)
}

// This function is called when the search button is clicked.
function onSearchBtnClicked(){
  // Clear the Table (Remove everything except the first row -header)
  $("#search-results-table").find("tr:gt(0)").remove()

  var itunesBaseUrl = "https://itunes.apple.com/search"

  // Find the key term from the searchInput
  var keyterm = $('#search-input').val()

  // Search only for songs that include that key term.
  var url = itunesBaseUrl + "?term=" + keyterm
  url += "&kind=song"

  httpGetAsync(url, function(response){
    var jsonResponse = JSON.parse(response)
    buildTableFromResults(jsonResponse.results)
  })
}

// Builds the table from the json responseText
function buildTableFromResults(results){
  results.forEach(function(result){
    var tableRow = buildTableRow(result)
    $('#search-results-table tr:last').after(tableRow)
  })
}

$(document).ready(function() {
    $("#search-btn").click(function(){
        onSearchBtnClicked()
    })
})

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000)
  var seconds = Math.round((millis % 60000) / 1000)
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
}

function buildTableRow(rowItem){
  var row = "<tr>"
  row += "<td>" + rowItem.artistName  + "</td>"
  row += "<td>" + rowItem.collectionName + "</td>"
  row += "<td>" + rowItem.trackName + "</td>"
  row += "<td>" + rowItem.primaryGenreName + "</td>"

  var duration = millisToMinutesAndSeconds(rowItem.trackTimeMillis)
  row += "<td>" + duration + "</td>"

  row += "<td><a href='" + rowItem.trackViewUrl + "' target='_blank'>Open</a></td>"
  row += "</tr>"
  return row
}

// Moving forward
// There is a lot more data coming back than what were are showing. Try logging the response to see what
// that data looks that. Include other data you find interesting into the table yourself.
//
// You may have noticed that there is some time between when we click the button and when the results are showing
// in the table. This would be the perfect opportunity to show a loading icon...
//
// We are also only handling an http status code of 200 (i.e. everything has gone right). In the real world you
// will want to handle errors as well. Look into http status codes and see if you can't figure out how you would
// handle an error if one were to occur.
//
// This is just scratching the surface. If you can do this, you can interact with the TONS of other web APIs out there.
// Reddits API is super simple like this one. If you want to try to get just a litttttle more advanced, look into working
// with an API that requires authentication (like Twitter or Facebook)
