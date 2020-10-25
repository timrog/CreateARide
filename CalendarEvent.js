function calendarDescription(model) { 
  return model.description + "\n\n" +
    (model.route? "<a href='" + model.route +"'>Strava route</a> [<a href='" + model.route + "/export_gpx'>GPX</a>]\n" : "") + 
    (model.stop? "Café stop: " + model.stop + (model.stopEta? " at " + model.stopEta : "") + "\n\n" : "\n") +
        
      (model.isExpired ? "Sign-up for this ride is now closed" : (
      "You <b>must</b> <a href='" + model.formUrl +"'>sign up</a> to join\n" +
      "<a href='" + model.responsesUrl +"'>See who else has signed up</a>\n\n" +
      "Email <a href='mailto:" + model.email +"'>" + model.organiser + "</a> with any questions"
      )
    )
}

function createOrUpdateCalendarEvent(model)
{
  const calendar = CalendarApp.getCalendarById(targetCalendar);
  
  var eventId = PropertiesService.getDocumentProperties().getProperty(model.id + "_event");
  var event = (eventId && calendar.getEventById(eventId));
  
  if(event && event.getStartTime() > new Date())
  { 
    model.formUrl = event.getTag("formUrl");
    model.responsesUrl = event.getTag("resultsUrl");
    model.formId = event.getTag("formId");
    console.log("Existing calendar event found", eventId);
  }
  else 
  {
    if (event)
      console.log("Event was found but it was in the past. Creating a new one");
    else
      console.log("No event found. Creating a new one.");
    
    console.log("Creating signup form...");
    const form = createSignupForm(model);
    
    console.log("Creating responses sheet");
    createResponsesSheet(model, form);
    
    console.log("Creating calendar event");
    event = calendar.createEvent(model.title, model.start, model.end);
    console.log("Calendar event created", event.getId());
  }
  
  console.log("Updating calendar event", eventId);
  updateCalendarEvent(event, model);
}

function updateCalendarEvent(event, model)
{
  event.setTime(model.start, model.end)
       .setLocation(model.location)
       .setTag("formUrl", model.formUrl || "")
       .setTag("formId", model.formId || "")
       .setTag("resultsUrl", model.responsesUrl)
       .setTitle(model.title)
  
  model.isExpired = eventHasExpired(event)
  event.setDescription(calendarDescription(model));
  
  if(model.isExpired) {
    console.log("Removing signup and responses sheet for", model.title)
    removeSignupForm(model.formId)
    //removeResponsesSheet(model.responsesUrl)
  }
  
  PropertiesService.getDocumentProperties().setProperty(model.id + "_event", event.getId());
}

function eventHasExpired(event){
  const isInFuture = event.getStartTime() > new Date()
  var isRecurring = false
  if (!isInFuture) {
    const instances = Calendar.Events.instances(targetCalendar, event.getId().split('@')[0], {timeMin: new Date().toISOString()})
    isRecurring = instances.items.length
  }
  
  return !isInFuture && !isRecurring
}