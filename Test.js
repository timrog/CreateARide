function resourcesCanBeFound()
{
  const form = FormApp.getActiveForm();
  form.getItems().forEach(function (i) { Logger.log("%s: %s", i.getId().toString(), i.getTitle()) });
  
  for (var id in itemIdLookup)
    if (!form.getItemById(id)) Logger.log("ERROR: Item with id %s does not exist", id.toString());
  
  if(!FormApp.openById(templateSignupForm))
    Logger.log("ERROR: template sign-up form not found")
  
  if(!SpreadsheetApp.openById(templateResponsesSheet))
    Logger.log("ERROR: template responses sheet not found")
    
  const calendar = CalendarApp.getCalendarById(targetCalendar)
  if (!calendar)
    Logger.log("ERROR: Target calendar does not exist");
  
  var event = calendar.createEvent("TEST", new Date(2001, 0, 1, 0, 0), new Date(2001, 0, 1, 1, 0))
  if(calendar.getEventsForDay(new Date(2001, 0, 1)).filter(function(e) { return e.getTitle() == "TEST" }).length == 0)
    Logger.log("ERROR: Created a calendar event but it couldn't be found.")
    
  event.deleteEvent()
  
  if (!DriveApp.getFolderById(targetFolder))
    Logger.log("ERROR: Target Drive folder does not exist");
  
  const ss = SpreadsheetApp.create("A test spreadsheet")
  moveToTargetFolder(ss)
  DriveApp.removeFile(DriveApp.getFileById(ss.getId()))
    
  if (!DriveApp.getFolderById(targetFolder))
     Logger.log("ERROR: Target Drive folder does not exist");
  
  Logger.log("OK");
}

function testProperties() {
  console.info(PropertiesService.getDocumentProperties().getProperties())
}