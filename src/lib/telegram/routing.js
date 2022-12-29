import {echo} from './command/echo'
import {invalid} from './command/invalid'
import {order} from './command/order'
import {ping} from './command/ping'
import {
  submitReport,
  visitReport,
  visitStart,
} from './command/visit'

export const command = (req) => (cmd) =>
  cmd === '/order'
    ? order (req)
    : cmd === '/visit'
    ? visitStart (req)
    : cmd === '/ping'
    ? ping (req)
    : cmd === '/echo'
    ? echo (req)
    : invalid (req)

export const callbackData = (req) => (data) =>
  data === 'visit_report'
    ? visitReport (req)
    : // : data === 'visit_survey'
      // ? surveyReport ()
      invalid (req)

export const hastag = (req) => (hashtag) =>
  hashtag === '#VisitReport'
    ? visitReport (req)
    : hashtag === '#SubmitReport'
    ? submitReport (req)
    : invalid (req)
