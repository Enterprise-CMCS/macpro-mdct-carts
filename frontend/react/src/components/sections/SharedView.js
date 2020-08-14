import React, { useState } from 'react'
import Section3C from './section3c/Section3C'
import { SharedViewAlert } from './../layout/SharedViewAlert'
import { Alert, Button } from "@cmsgov/design-system-core"



export const SharedView = _ => {
  const showModal = _ => {
    return (<SharedViewAlert />)
  }

  return (
    <>
      <Alert heading="Someone has shared this section with you to edit" className="ds-u-margin-top--4">
        <p className="ds-c-alert__text ds-u-measure--wide">You’ll be able to view and edit this page for 7 days, unless they revoke your access before then.
        All finished?</p>
        <Button className="ds-c-button ds-c-button--primary ds-c-button--small ds-u-margin-top--1 ds-u-margin-bottom--1" onClick={showModal}>I’m finished with this section</Button>
        <p className="ds-c-alert__text ds-u-measure--wide">You’ll no longer be able to edit this page once you’re finished, unless you receive a new link to edit this section again.</p>
      </Alert>
      <Section3C />
    </>
  )
}