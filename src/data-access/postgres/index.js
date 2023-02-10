import {
  findAllSales,
  findOneSalesById,
  findOneSalesByTelegramId,
  insertManyToSales,
  insertOneToSales,
} from './sales'
import {
  findAllSurveys,
  findAllSurveysByReason,
  findAllSurveysByReasonByDate,
  insertManyToSurveys,
  insertOneToSurveys,
} from './surveys'
import {
  findAllTodayVisits,
  findAllVisits,
  findAllVisitsByDate,
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
  findAllSurveysByReason,
  findAllSurveysByReasonByDate,
  findAllVisits,
  findAllVisitsByDate,
  findAllTodayVisits,
  insertManyToVisits,
  insertOneToVisits,
}
