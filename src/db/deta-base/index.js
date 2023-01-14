import {Deta} from 'deta'
import {F} from '../../lib/fluture'

require ('dotenv').config ()

const {DETA_KEY} = process.env

export const flDetaBase = (method) =>
  F.encaseP ((data) =>
    Deta (DETA_KEY).Base ('the-bot')[method] (data),
  )
