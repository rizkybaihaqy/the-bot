import {Deta} from 'deta'
import {DETA_KEY} from '../../config'
import {F} from '../../lib/fluture'

export const flDetaBase = method =>
  F.encaseP (Deta (DETA_KEY).Base ('the-bot')[method])
