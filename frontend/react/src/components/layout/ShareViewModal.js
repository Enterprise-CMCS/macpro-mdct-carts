import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Dialog } from "@cmsgov/design-system-core"
import { underReview } from '../../store/shareLinkActions'

export const ShareViewModalConnected = props => {
  const [submit, setSubmit] = useState(false)
  const handleSubmit = _ => {
    setSubmit(true)
    //TODO: setTimeout(_=>{}, 5000)
    props.submitOnClick(submit)
  }
  return (
    <Dialog
      onExit={props.hide}
      getApplicationNode={() => document.getElementById('App')}
      heading="Before you submit"
      actions={[
        <button
          className={`ds-c-button ds-c-button--primary ${submit && `ds-u-display--none`}`}
          key="primary"
          onClick={handleSubmit}>
          Submit
        </button>,
        <button
          className={`ds-c-button ds-c-button--transparent ${submit && `ds-u-display--none`}`}
          key="cancel"
          onClick={props.hide}
        >
          Cancel
        </button>,
      ]}
    >
      You’ll no longer be able to edit this page once you’re finished, unless you receive a new link to edit this section again.
      {submit && <div>
        <h2>Thank you!</h2>
        <p>Your form has been submitted.</p>
      </div>}
    </Dialog>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    submitOnClick: link => dispatch(underReview(link))
  }
}

const ShareViewModal = connect(null, mapDispatchToProps)(ShareViewModalConnected)
export default ShareViewModal
