import React, { useState } from 'react'
import Section3C from './section3c/Section3C'
import { SharedViewModal } from '../layout/SharedViewModal'
import { Alert, Button } from "@cmsgov/design-system-core"

export const SharedView = _ => {
  const [modal, setModal] = useState(false)
  const showModal = _ => {
    setModal(true)
  }

  const hideModal = _ => {
    setModal(!modal)
  }

  return (
    <>
      <Alert heading="Someone has shared this section with you to edit" className="ds-u-margin-top--4">
        <p className="ds-c-alert__text ds-u-measure--wide">You’ll be able to view and edit this page for 7 days, unless they revoke your access before then.
        All finished?</p>
        <Button className="ds-c-button ds-c-button--primary ds-c-button--small ds-u-margin-top--1 ds-u-margin-bottom--1" onClick={_ => showModal(true)}>I’m finished with this section</Button>
      </Alert>
      {modal && <SharedViewModal hide={hideModal} />}
      <Section3C />
    </>
  )
}