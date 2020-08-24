// ACTIONS
export const CREATE_SHARE_LINK = 'CREATE_SHARE_LINK'
export const UNDER_REVIEW = 'UNDER_REVIEW'
export const EXPIRE_SHARE_LINK = 'EXPIRE_SHARE_LINK'

// CREATORS
export const createShareLink = url => (
  {
    type: CREATE_SHARE_LINK,
    payload: { url }
  }
)
export const submitReview = url => (
  {
    type: UNDER_REVIEW,
    payload: { url }
  }
)

export const expireShareLink = url => (
  {
    type: EXPIRE_SHARE_LINK,
    payload: { url }
  }
)
