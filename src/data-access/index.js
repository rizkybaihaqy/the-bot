import {DB_CHOICE} from '../config'
import detaBase from './deta-base'
import pg from './postgres'

const dbChoice = DB_CHOICE === 'DETA_BASE' ? detaBase : pg

export const insertOneToSales = dbChoice.insertOneToSales
export const findOneSalesByTelegramId =
  dbChoice.findOneSalesByTelegramId
export const findOneSalesById = dbChoice.findOneSalesById
export const insertManyToSales = dbChoice.insertManyToSales
export const insertOneToSurveys =
  dbChoice.insertOneToSurveys
export const insertManyToSurveys =
  dbChoice.insertManyToSurveys
export const insertOneToVisits = dbChoice.insertOneToVisits
export const insertManyToVisits =
  dbChoice.insertManyToVisits
export const findAllTodayVisits =
  dbChoice.findAllTodayVisits
