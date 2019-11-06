import React, { useState, useEffect } from 'react'
import { Crew } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import CrewTable from './CrewTable'
import settingsService from '../../emulator/settingsService'

function getNextJob(listWorker: object[], countEmployers: number, settService: any) {
  let choosenJob: string = ''; // ініціалізуємо початкове значення вибраної роботи для безробітного працівника
  Object.keys(listWorker).forEach((work: any) => { // перетворємо обьект в масив, проходимо по всім значенням масиву
    const countByType: any = listWorker[work]
    if (countByType / countEmployers * 100 < settService[work]) { // якщо відсоток поточних членів екіпажу не вибраній посаді менше аніж зазначено в налаштуваннях
      if (choosenJob === '') // якщо початкове значення ще не було змінено на назву посади
        choosenJob = work // привласнуємо змінній, вибрану посаду для нового члена екіпажу
    }
  })
  return choosenJob
}

function CrewPage(props: {}) {
  const [crew, setCrew] = useState<Crew>([])

  useEffect(() => {
    const unsub = crewService.onSummary(
      (onCrew) => {
        crewService.getCrew().then(response => {
          response.filter(user => user.job === "unassigned").forEach((unemployed: any) => {
            let countEmployers = response.length // загальні кількість членів екіпажу
            let numberOfEmployees: any = { // записуємо  кільість членів екіпажу на кожній посаді відповідно
              medic: response.filter((item: any) => item.job === 'medic').length,
              engineer: response.filter((item: any) => item.job === 'engineer').length,
              pilot: response.filter((item: any) => item.job === 'pilot').length
            }
            let choosenJob: any = getNextJob(numberOfEmployees, countEmployers, settingsService.getJobSplit())
            if (choosenJob) crewService.assignJob(unemployed.id, choosenJob) // назначаємо безробітному члену екіпажу нову посаду
          })
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
