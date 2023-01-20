import {
  findAllSales,
  findOneSalesById,
  findOneSalesByTelegramId,
  insertManyToSales,
  insertOneToSales,
} from './sales'
import {
  findAllSurveys,
  insertManyToSurveys,
  insertOneToSurveys,
} from './surveys'
import {
  findAllTodayVisits,
  findAllVisits,
  insertManyToVisits,
  insertOneToVisits,
} from './visits'

export default {
  insertOneToSales,
  findOneSalesByTelegramId,
  findOneSalesById,
  findAllSales,
  insertManyToSales,
  insertManyToSurveys,
  insertOneToSurveys,
  findAllSurveys,
  findAllVisits,
  findAllTodayVisits,
  insertManyToVisits,
  insertOneToVisits,
}
