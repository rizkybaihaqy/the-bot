import detaBase from './deta-base'
import pg from './postgres'

require ('dotenv').config ()

const dbChoice =
  process.env.DB_CHOICE === 'DETA_BASE' ? detaBase : pg

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
