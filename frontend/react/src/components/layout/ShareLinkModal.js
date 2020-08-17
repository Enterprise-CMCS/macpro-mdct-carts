import React from 'react'
import { Dialog } from "@cmsgov/design-system-core"
import { useState } from 'react'
import { ShareLinkCopy } from './ShareLinkCopy'

export const ShareLinkModal = ({ hide }) => {
  const [link, setLink] = useState('')
  const showGeneratedLink = _ => setLink(true)
  const revokeGeneratedLink = _ => setLink(false)
  const showActions =
    [
      <button
        onclick={showGeneratedLink}
        className="ds-c-button ds-c-button--primary"
        key="primary">
        Generate
    </button>,
      <button
        className="ds-c-button ds-c-button--transparent"
        key="cancel"
        onClick={hide}
      >
        Cancel
        </button>
    ]
  const revokeActions = [
    <button
      onclick={revokeGeneratedLink}
      className="ds-c-button ds-c-button--primary"
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
      actions={(link && showActions)}
    >
      Generate a link to share this section with someone on your team. Once you share the link, they’ll be able to edit the page until the link expires in 7 days. If you need to edit the page before then, you can cancel the link and revoke their access. You can always generate a new link to share the page again.
      <ShareLinkCopy />
    </Dialog>
  )
}