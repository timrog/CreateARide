const props = PropertiesService.getScriptProperties()
const targetCalendar = props.getProperty("targetCalendar")
const targetFolder = props.getProperty("targetFolder")
const templateSignupForm = props.getProperty("templateSignupForm")
const templateResponsesSheet = props.getProperty("templateResponsesSheet")

const itemIdLookup = 
    JSON.parse(
      props.getProperty("itemIdLookup")
    )