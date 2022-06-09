import _ from 'lodash'

export function checkWhiteSpace(text) {
    var format = /^[^a-zA-Z0-9]+$/
    if (_.isEmpty(text)) {
      return false
    }
    if (format.test(text)) {
      return false
    } else {
      return true
    }
}
