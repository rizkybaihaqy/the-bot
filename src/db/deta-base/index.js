import {Deta} from 'deta'
import {F} from '../../lib/fluture'

require ('dotenv').config ()

const {DETA_KEY} = process.env

const detaBase = Deta (DETA_KEY).Base ('the-bot')

export const flDetaBase = (method) =>
  F.encaseP ((data) => detaBase[method] (data))
