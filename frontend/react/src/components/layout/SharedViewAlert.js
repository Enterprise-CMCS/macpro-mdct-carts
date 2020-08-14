import React from 'react'
import { Dialog } from "@cmsgov/design-system-core"

export const SharedViewAlert = _ => {

  return (
    <Dialog
      getApplicationNode={() => document.getElementById('App')}
      heading="Dialog heading"
      actions={[
        <button className="ds-c-button ds-c-button--primary" key="primary">
          Dialog action
        </button>,
        <button
          className="ds-c-button ds-c-button--transparent"
          key="cancel"
        >
          Cancel
        </button>,
      ]}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan diam vitae metus
      lacinia, eget tempor purus placerat.
    </Dialog>
  )
}