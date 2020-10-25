function doGet(e) {
  var form = FormApp.getActiveForm();
  var responses = form.getResponses().map(mapResponse);
  return ContentService.createTextOutput(JSON.stringify(responses));
}
