import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const responseStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    isLoading: true,
    status: responseStatus.initial,
    covidVaccinationDetails: [],
  }

  componentDidMount() {
    this.getCovidVaccinationDetails()
  }

  getCovidVaccinationDetails = async () => {
    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(covidVaccinationDataApiUrl)

    if (response.ok === true) {
      const data = await response.json()
      const convertDataToCamelCase = [data].map(item => ({
        last7DaysVaccination: item.last_7_days_vaccination,
        vaccinationByAge: item.vaccination_by_age,
        vaccinationByGender: item.vaccination_by_gender,
      }))
      this.setState({
        isLoading: false,
        status: responseStatus.success,
        covidVaccinationDetails: convertDataToCamelCase,
      })
    } else {
      this.setState({
        isLoading: false,
        status: responseStatus.failure,
      })
    }
  }

  onSuccessAPICall = () => {
    const {covidVaccinationDetails} = this.state
    return (
      <div>
        <VaccinationCoverage
          vaccinationCoverage={covidVaccinationDetails[0].last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGender={covidVaccinationDetails[0].vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAge={covidVaccinationDetails[0].vaccinationByAge}
        />
      </div>
    )
  }

  onFailureAPICall = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-view-heading">Something Went Wrong</h1>
    </div>
  )

  renderCovidDashBoard = () => {
    const {status} = this.state
    switch (status) {
      case responseStatus.success:
        return this.onSuccessAPICall()

      case responseStatus.failure:
        return this.onFailureAPICall()

      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  render() {
    const {isLoading} = this.state
    return (
      <div className="main-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo-size"
          />
          <h1 className="logo-heading">co-WIN</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        {isLoading ? this.renderLoader() : this.renderCovidDashBoard()}
      </div>
    )
  }
}

export default CowinDashboard
