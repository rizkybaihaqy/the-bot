import config from '../config'

const dbChoice =
  config.DB_CHOICE === 'DETA_BASE'
    ? require ('./deta-base')
    : require ('./postgres')

export const insertOneToSales = dbChoice.insertOneToSales
export const findOneSalesByTelegramId =
  dbChoice.findOneSalesByTelegramId
export const findOneSalesById = dbChoice.findOneSalesById
export const findAllSales = dbChoice.findAllSales
export const insertManyToSales = dbChoice.insertManyToSales
export const insertOneToSurveys =
  dbChoice.insertOneToSurveys
export const insertManyToSurveys =
  dbChoice.insertManyToSurveys
export const findAllSurveys = dbChoice.findAllSurveys
export const findAllSurveysByReason =
  dbChoice.findAllSurveysByReason
export const findAllVisits = dbChoice.findAllVisits
export const insertOneToVisits = dbChoice.insertOneToVisits
export const insertManyToVisits =
  dbChoice.insertManyToVisits
export const findAllTodayVisits =
  dbChoice.findAllTodayVisits
