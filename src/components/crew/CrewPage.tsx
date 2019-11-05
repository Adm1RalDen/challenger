import React, { useState, useEffect } from 'react'
import { Crew } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import CrewTable from './CrewTable'
import settingsService from '../../emulator/settingsService'

function CrewPage (props: {}) {
  const [ crew, setCrew ] = useState<Crew>([])
  const stgService = useState(settingsService.getJobSplit())
  
  useEffect(() => {
    const unsub = crewService.onSummary(
      (onCrew) => {
        crewService.getCrew().then(response => {   
          setCrew(response)
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
