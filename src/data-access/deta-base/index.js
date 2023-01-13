import {
  findOneSalesById,
  findOneSalesByTelegramId,
  insertManyToSales,
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
  findOneSalesByTelegramId,
  findOneSalesById,
  insertManyToSales,
  insertManyToSurveys,
  insertOneToSurveys,
  findAllTodayVisits,
  insertManyToVisits,
  insertOneToVisits,
}
