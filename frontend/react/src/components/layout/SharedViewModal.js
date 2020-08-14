import React from 'react'
import { Dialog } from "@cmsgov/design-system-core"

export const SharedViewModal = ({ hide }) => {
  return (
    <Dialog
      onExit={hide}
      getApplicationNode={() => document.getElementById('App')}
      heading="Before you submit"
      actions={[
        <button className="ds-c-button ds-c-button--primary" key="primary">
          Submit
        </button>,
        <button
          className="ds-c-button ds-c-button--transparent"
          key="cancel"
          onClick={hide}
        >
          Cancel
        </button>,
      ]}
    >
      You’ll no longer be able to edit this page once you’re finished, unless you receive a new link to edit this section again.
    </Dialog>
  )
}