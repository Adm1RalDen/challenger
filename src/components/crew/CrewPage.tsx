import React, { useState, useEffect } from 'react'
import { Crew } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import CrewTable from './CrewTable'
import settingsService from '../../emulator/settingsService'

function chooseJob(listWorker: object[], settService: any) { // функція підбору роботи для нового члена команди
  let count = listWorker.length // кількість членів екіпажу
  let chosenWorker: any = listWorker.filter((item: any) => item.job === "unassigned" ? true : false) //  шукаємо членів екіпажу в яких немає роботи
  if (chosenWorker.length !== 0) { // якщо кількість безробітних членів екіпажу дорівнює нулю, то необхідності в пошуку роботи немає, повертаємо -1
    let countWorkers = { // записуємо  кільість членів екіпажу на кожній посаді відповідно
      medic: listWorker.filter((item: any) => item.job === 'medic').length,
      engineer: listWorker.filter((item: any) => item.job === 'engineer').length,
      pilot: listWorker.filter((item: any) => item.job === 'pilot').length
    }
    let choosenJob: string = ''; // ініціалізуємо початкове значення вибраної роботи для безробітного працівника
    Object.entries(countWorkers).forEach((item: any) => { // перетворємо обьект в масив, проходимо по всім значенням масиву
      if (item[1] / count * 100 < settService[item[0]]) { // якщо відсоток поточних членів екіпажу не вибраній посаді менше аніж зазначено в налаштуваннях
        if (choosenJob === '') // якщо початкове значення ще не було змінено на назву посади
          choosenJob = item[0] // привласнуємо змінній, вибрану посаду для нового члена екіпажу
      }
    })
    return [choosenJob, chosenWorker[0].id] // повертаємо масив стрічок, зі значеннями вибраної роботи та айді безробітного члена екіпажу
  }
  return -1 // повертаэмо -1 якщо безробтіних членів екіпажу не було знайдено
}

function CrewPage(props: {}) {
  const [crew, setCrew] = useState<Crew>([])
  
  useEffect(() => {
    const unsub = crewService.onSummary(
      (onCrew) => {
        crewService.getCrew().then(response => {
          let temp: any = chooseJob(response, settingsService.getJobSplit()) // вривласнюємо змінній результат роботи функції вибору посади новому члену екіпажу
          if (temp !== -1) { // якщо резьтат функції не дорівнює -1 
            crewService.assignJob(temp[1], temp[0]) // назначаємо безробітному члену екіпажу нову посаду
          }
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
