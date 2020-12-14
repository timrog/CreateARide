function createSignupForm(model){
  const title = model.title + " sign-up"
  const file = DriveApp.getFileById(templateSignupForm)
    .makeCopy(title, DriveApp.getFolderById(targetFolder))
  const form = FormApp.openById(file.getId())
  
  form.setTitle(title)
  
  model.formUrl = form.getPublishedUrl()
  model.formId = form.getId()
  console.log("Form created: " + form.getPublishedUrl())
  
  return form
}

function createResponsesSheet(model, form)
{
  const title = model.title + " responses"
  const file = DriveApp.getFileById(templateResponsesSheet)
    .makeCopy(title, DriveApp.getFolderById(targetFolder))
  
  form.setDestination(FormApp.DestinationType.SPREADSHEET, file.getId())
  
  model.responsesUrl = file.getUrl()
 
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
 
  return file
}

function updateResponsesSheet(model) 
{
  const ss = SpreadsheetApp.openByUrl(model.responsesUrl)
  const static = ss.getSheetByName("Static")
  let i = 1
  for(let k in model) { 
    static.getRange(i, 1).setValue(k)
    static.getRange(i++, 2).setValue(model[k])    
  }
  static.hideSheet()
  
  const responseSheet = ss.getSheets().filter(s => !!s.getFormUrl())[0]
  console.log("Found response sheet:", responseSheet.getName())
  responseSheet.hideSheet()
  
  const projection = ss.getSheetByName("All responses")
  projection.getRange(1,1).setFormula(`{'${responseSheet.getName()}'!1:1000}`)
  
  return ss
}

function moveToTargetFolder(doc)
{
    const file = DriveApp.getFileById(doc.getId());
    DriveApp.getFolderById(targetFolder).addFile(file);
    DriveApp.getRootFolder().removeFile(file);
}

function removeSignupForm(id)
{
  try { 
    const file = DriveApp.getFileById(id)
    Drive.Files.remove(file.getId())
  } catch(e) {
    console.warn("Cannot remove signup form", id)
  }
}

function removeResponsesSheet(url)
{
  try { 
    console.info("Removing signup sheet", url)
    const file = DriveApp.getFileById(SpreadsheetApp.openByUrl(url).getId())
    
    console.info("Found file", file.getName(), file.isTrashed(), file.getId())
    Drive.Files.remove(file.getId())
  } catch(e) {
    console.warn("Cannot remove responses sheet", url)
  }
}