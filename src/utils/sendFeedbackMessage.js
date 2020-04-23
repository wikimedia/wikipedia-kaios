const GOOGLE_FORM_MESSAGE_ID = 'entry.126617860'
const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeql9NL1PduVzQjTnVdPM4itLTR_qPp7h10PN2wE5aTGPf0-w/formResponse'
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

const message = "TEST FEEDBACK MESSAGE: Cari's bday on earth day"

export const sendFeedbackMessage = () => {
  const formData = new FormData()
  formData.append(GOOGLE_FORM_MESSAGE_ID, message)

  console.log('sendFeedbackMessage(), formData...', formData)

  const http = new XMLHttpRequest()
  http.open('POST', CORS_PROXY + GOOGLE_FORM_ACTION_URL, true)

  // Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

  http.onreadystatechange = function () { // Call a function when the state changes.
    // console.log('onreadystatechange - http...', http)
    if (http.readyState === 4 && http.status === 200) {
      // alert(http.responseText)
      console.log('onreadystatechange - http.response...', http.response)
    }
  }
  http.send(formData)
}
