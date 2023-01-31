import {capitalCase} from 'change-case'
import {S} from '../sanctuary'
import {tagByWithMessage} from './function'
import {objDiff} from './getter'

// StrMap F -> StrMap String -> Either String StrMap String
export const validate = rules =>
  S.ifElse (S.pipe ([objDiff (rules), x => x.length === 0])) (
    S.pipe ([
      S.map (S.Right),
      S.ap (rules),
      S.sequence (S.Either),
    ])
  ) (
    S.pipe ([
      objDiff (rules),
      S.map (capitalCase),
      x => 'Data ' + x + ' harus ada',
      S.Left,
    ])
  )

export const validator = name => predicates =>
  S.compose (S.mapLeft (S.concat (name + ' '))) (
    S.pipeK (predicates)
  )

export const notAnEmpty = type =>
  tagByWithMessage ('Cannot be empty') (
    S.complement (S.equals (S.empty (type)))
  )
