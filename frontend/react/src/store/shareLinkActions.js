// ACTIONS
export const CREATE_SHARE_LINK = 'CREATE_SHARE_LINK'
export const SUBMIT_REVIEW = 'SUBMIT_REVIEW'
export const EXPIRE_SHARE_LINK = 'EXPIRE_SHARE_LINK'

// CREATORS
export const createShareLink = url => (
  {
    type: CREATE_SHARE_LINK,
    payload: { url }
  }
)
export const underReview = url => (
  {
    type: SUBMIT_REVIEW,
    payload: { url }
  }
)

export const expireShareLink = url => (
  {
    type: EXPIRE_SHARE_LINK,
    payload: { url }
  }
)
