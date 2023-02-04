import {formatISO9075} from 'date-fns'
import {utcToZonedTime} from 'date-fns-tz'
import {S} from '../sanctuary'

export const dateToStringWithTZ = S.compose (formatISO9075) (
  isoDate => utcToZonedTime (isoDate, 'Asia/Jakarta')
)

export const now = dateToStringWithTZ (new Date ())
