import React from 'react'

/**
 * 
 * Autosave status message. 
 * Should connect to store for latest status.
 * @returns styled autosave text or an empty column.
 * excluded - Array of pages to that do not show the Autosave message.
 */
const Autosave = _ => {
  const path = window.location.path
  const excluded = ['/', 'no-access']
  const autosaveText = `Autosave`
  return (
    (excluded.indexOf(path) > -1)
      ?
      <div className="save-status ds-l-col--6 ds-u-border--0"></div>
      :
      <div className="save-status ds-l-col--6">{autosaveText}</div>
  )
}

export default Autosave
