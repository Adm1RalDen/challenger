import React, { useState, useEffect } from 'react'
import { Crew } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import CrewTable from './CrewTable'
import settingsService from '../../emulator/settingsService'

function getNextJob(numberOfEmployees: object[], countEmployers: number, jobSplit: any) {
  let choosenJob: string = ''; // ініціалізуємо початкове значення вибраної роботи для безробітного працівника
  Object.keys(numberOfEmployees).forEach((work: any) => { // перетворємо обьект в масив, проходимо по всім значенням масиву
    const countByType: any = numberOfEmployees[work]
    if (countByType / countEmployers * 100 < jobSplit[work]) { // якщо відсоток поточних членів екіпажу не вибраній посаді менше аніж зазначено в налаштуваннях
      if (choosenJob === '') // якщо початкове значення ще не було змінено на назву посади
        choosenJob = work // привласнуємо змінній, вибрану посаду для нового члена екіпажу
    }
  })
  return choosenJob
}

function CrewPage(props: {}) {
  const [crew, setCrew] = useState<Crew>([])

  useEffect(() => {
    crewService.getCrew().then(response => setCrew(response))
  }, [])

  useEffect(() => {
    const unsub = crewService.onMemberAdded(
      (newCrew) => {
        crewService.getCrew().then(response => {
            let { unassigned,  ...numberOfEmployees }: any = crewService.getSummary().counts // отримання кількості працівників на кожній посаді
            let choosenJob: any = getNextJob(numberOfEmployees, response.length, settingsService.getJobSplit()) // пошук роботи для нового члена екіпажу
            if (choosenJob) crewService.assignJob(newCrew.id, choosenJob) // назначаємо безробітному члену екіпажу нову посаду
            setCrew(response) // обновляємо значення поточного стану таблиці
        })
      }
    )
    return unsub
  }, [])


  return <div className='tableContainer'>
    <CrewTable crew={crew} />
  </div>
}

export default CrewPage
