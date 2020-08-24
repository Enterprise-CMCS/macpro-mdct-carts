import { CREATE_SHARE_LINK, SUBMIT_REVIEW, EXPIRE_SHARE_LINK } from './shareLinkActions'

const initialState = {
  url: '',
  underReview: false,
  isExpired: false,
}

export const shareLink = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case CREATE_SHARE_LINK: {
      const newState = {
        url: payload.url,
        underReview: true,
        isExpired: false,
      }
      return { ...state, ...newState }
    }
    case SUBMIT_REVIEW: {
      const reviewState = {
        underReview: false,
      }
      return { ...state, ...reviewState }
    }
    case EXPIRE_SHARE_LINK: {
      const expiredState = {
        underReview: false,
        isExpired: true,
      }
      return { ...state, ...expiredState }
    }
    default:
      return state
  }
}
