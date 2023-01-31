import React from 'react'
import RegularInitialPrayers from "./RegularInitialPrayers"
import SettingsIcon from './SettingsIcon'

const NinthHour = () => {
  return (
    <div className='service'>
      {/* <SettingsIcon  /> */}
        <h2 className="service-name">Godzina Dziewiąta</h2>
        <RegularInitialPrayers />
        <h3 className="service-h3">Psalm 83</h3>
        <h3 className="service-h3">Psalm 84</h3>
        <h3 className="service-h3">Psalm 85</h3>
    </div>
  )
}

export default NinthHour