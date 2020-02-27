import { getContent } from '../../open-authoring/github/api'
import ContentNotFoundError from './ContentNotFoundError'
import { b64DecodeUnicode } from '../../open-authoring/utils/base64'

// Throw a formatted error on 404, and decode github data properly
const getDecodedData = async (repoFullName, headBranch, path, accessToken) => {
  try {
    const { data } = await getContent(
      repoFullName,
      headBranch,
      path,
      accessToken
    )

    return { ...data, content: b64DecodeUnicode(data.content) }
  } catch (e) {
    if ((e.response?.status || 0) == 404) {
      throw new ContentNotFoundError(
        'Content not found. Your fork may have been deleted.'
      )
    } else {
      throw e
    }
  }
}

export default getDecodedData
