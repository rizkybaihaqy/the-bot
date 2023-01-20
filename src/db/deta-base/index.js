import {Deta} from 'deta'
import {DETA_KEY} from '../../config'
import {F} from '../../lib/fluture'

const deta = Deta (DETA_KEY)

export const flDetaBase = method =>
  // eslint-disable-next-line functional/prefer-tacit
  F.encaseP (data => deta.Base ('the-bot')[method] (data))
