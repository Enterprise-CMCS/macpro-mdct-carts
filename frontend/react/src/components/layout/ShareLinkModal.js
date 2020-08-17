import React from 'react'
import { Button, Dialog, TextField } from "@cmsgov/design-system-core"
import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

export const ShareLinkModal = ({ hide }) => {
  const [link, linkGenerated] = useState('')
  const copyUrl = "https://cartsdemo.cms.gov/l32kksf3isdgf823nsd9"
  const expires = `7`

  const generateLink = _ => {
    linkGenerated(true)
  }

  const revokeLink = _ => {
    linkGenerated(!link)
  }

  const generateActions = [
    <button
      onClick={generateLink}
      className={`ds-c-button ds-c-button--primary ${link && `ds-u-display--none`}`}
      key="primary">
      Generate
    </button>,
    <button
      onClick={revokeLink}
      className={`ds-c-button ds-c-button--danger ${link || `ds-u-display--none`}`}
      key="primary">
      Revoke
    </button>,
    <button
      className="ds-c-button ds-c-button--transparent"
      key="cancel"
      onClick={hide}
    >
      Cancel
    </button>
  ]

  return (
    <Dialog
      onExit={hide}
      getApplicationNode={() => document.getElementById('App')}
      heading="Share this section"
      actions={generateActions}
    >
      Generate a link to share this section with someone on your team. Once you share the link, they’ll be able to edit the page until the link expires in {expires} days. If you need to edit the page before then, you can cancel the link and revoke their access. You can always generate a new link to share the page again.
      {/* Replace with SharedLinkCopy component */}
      {link &&
        (<form>
          <TextField name="copyUrl" value={copyUrl} disabled />
          <Button
            className="ds-c-button--transparent ds-c-button--small"
            title="Copy to clipboard"
          >
            <FontAwesomeIcon icon={faCopy} />
          </Button>
        </form>)}
    </Dialog>
  )
}