import axios from 'axios'
import Future, {encaseP, fork} from 'fluture'
import {S} from '../sanctuary/instance'
import {tap} from '../utils'

export const eitherToFuture = S.either (Future.reject) (
  Future.resolve,
)

export const execute = fork (S.I) (S.I)

export const flAxios = encaseP (axios)
