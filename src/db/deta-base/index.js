import {Deta} from 'deta'
import config from '../../config'
import {F} from '../../lib/fluture'

const deta = Deta (config.DETA_KEY)

export const flDetaBase = method =>
  // eslint-disable-next-line functional/prefer-tacit
  F.encaseP (data =>
    deta.Base (config.DETA_BASE)[method] (data)
  )
