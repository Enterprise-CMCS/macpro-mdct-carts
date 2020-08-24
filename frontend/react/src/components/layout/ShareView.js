import React, { useState } from 'react'
import { connect } from 'react-redux'
import Section3C from '../sections/section3c/Section3C'
import NoAccess from './NoAccess'
import ShareViewModal from './ShareViewModal'
import { Alert, Button } from "@cmsgov/design-system-core"

const ShareViewConnected = props => {
  const [modal, setModal] = useState(false)
  const toggleModal = _ => {
    setModal(!modal)
  }
  return (
    (props.reviewStatus ?
      <>
        <Alert heading="Someone has shared this section with you to edit" className="ds-u-margin-top--4">
          <p className="ds-c-alert__text ds-u-measure--wide">You’ll be able to view and edit this page for 7 days, unless they revoke your access before then.
        </p>
          <Button
            className="ds-c-button ds-c-button--primary ds-c-button--small ds-u-margin-top--1 ds-u-margin-bottom--1"
            onClick={toggleModal}>I’m finished with this section</Button>
        </Alert>
        {modal && <ShareViewModal hide={toggleModal} />}
        <Section3C /> {/* Replace with user's current section.  */}
      </>
      : <NoAccess />)
  )
}

const mapStateToProps = state => {
  const { shareLink } = state
  return {
    reviewStatus: shareLink.underReview
  }
}

const ShareView = connect(mapStateToProps)(ShareViewConnected)
export default ShareView
