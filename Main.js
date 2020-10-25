function onFormSubmit(e) {
  console.log("Received form response", e.response.getId());
  const model = mapResponse(e.response);
  console.log(model);
  createOrUpdateCalendarEvent(model); 
}

function mapResponse(r) {
  const result = {};
  const itemResponses = r.getItemResponses();
  
  for (var i = 0; i < itemResponses.length; i++) {
    var item = itemResponses[i].getItem(), id = item.getId().toString();
    var response = itemResponses[i].getResponse();
    result[itemIdLookup[id] || id] = response;
  }
  
  result.start = new Date(result.date + "T" + result.startTime);
  
  const end = new Date(result.date + "T" + result.endTime);
  result.end = end > result.start ? end : new Date(result.start.valueOf() + 4 * 60 * 60000);
  result.id =  r.getId().replace(/[^0-9a-zA-Z]/g, "");
  result.email = r.getRespondentEmail();
  result.route = result.route && result.route.replace(/^.*?(\d+)$/, "https://www.strava.com/routes/$1");
  
  return result;
}