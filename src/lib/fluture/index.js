import axios from 'axios'
import * as fluture from 'fluture'
import {Json} from 'fluture-express'
import {S} from '../sanctuary'

export const F  = fluture

export const eitherToFuture = S.either (F.reject) (F.resolve)

export const execute = F.fork (S.I) (S.I)

export const flAxios = F.encaseP (axios)

export const JSONData = S.compose (Json) (S.prop ('data'))
