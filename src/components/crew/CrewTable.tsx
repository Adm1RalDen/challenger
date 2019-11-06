import React from 'react'
import { Crew } from '../../emulator/types'

export default function CrewTable(props: { crew: Crew }) {
  return <table>
    <tbody>
      {props.crew.sort((member1, member2) => member1.lastName > member2.lastName ? 1 : -1).map(member => <tr key={member.id}>
        <td>{member.id}</td>
        <td>{member.lastName}, {member.firstName}</td>
        <td>
          <span className={member.job}>
            {member.job}
          </span>
        </td>
      </tr>)}
    </tbody>
  </table>
}
