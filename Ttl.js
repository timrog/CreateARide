function installTtl() { 
  ScriptApp.newTrigger("enforceTtl").timeBased().everyDays(1).create()
}

function enforceTtl() {
  const form = FormApp.getActiveForm()
  const lastRun = new Date(PropertiesService.getScriptProperties().getProperty("ttlLastRun") || 0)
  console.info("Enforcing TTL on everything since " + lastRun)
  
  form.getResponses().map(mapResponse)
    .filter(function(response) { 
      return response.start.valueOf() < new Date().valueOf() && response.start.valueOf() > lastRun.valueOf()
    })
    .forEach(update)
  
  PropertiesService.getScriptProperties().setProperty("ttlLastRun", new Date())
}

function update(response) {
  const calendar = CalendarApp.getCalendarById(targetCalendar);
  
  const eventId = PropertiesService.getDocumentProperties().getProperty(response.id + "_event");
  const event = eventId && calendar.getEventById(eventId)
  if(event) { 
    console.info("Updating event description for " + response.title)    
    response.formUrl = event.getTag("formUrl");
    response.responsesUrl = event.getTag("resultsUrl");

    updateCalendarEvent(event, response)
  }
}
