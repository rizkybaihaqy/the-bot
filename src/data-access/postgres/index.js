import {
  findOneSalesById,
  findOneSalesByTelegramId,
  insertManyToSales,
  insertOneToSales,
} from './sales'
import {
  insertManyToSurveys,
  insertOneToSurveys,
} from './surveys'
import {
  findAllTodayVisits,
  insertManyToVisits,
  insertOneToVisits,
} from './visits'

export default {
  insertOneToSales,
  findOneSalesByTelegramId,
  findOneSalesById,
  insertManyToSales,
  insertManyToSurveys,
  insertOneToSurveys,
  findAllTodayVisits,
  insertManyToVisits,
  insertOneToVisits,
}
