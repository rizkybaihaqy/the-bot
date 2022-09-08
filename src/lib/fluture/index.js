import axios from 'axios'
import F from 'fluture'
import {S} from '../sanctuary/instance'

export const eitherToFuture = S.either (F.reject) (F.resolve)

export const execute = F.fork (S.I) (S.I)

export const flAxios = F.encaseP (axios)
