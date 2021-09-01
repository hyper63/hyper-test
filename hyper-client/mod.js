import data from './data/mod.js'

export default function (connectionString) {
  const cs = new URL(connectionString)
  const createToken = (u, p) => `${u}:${p}` // need to change to create jwt

  const buildRequest = service => {
    const isHyperCloud = cs.protocol === 'cloud:'
    const protocol = isHyperCloud ? 'https:' : cs.protocol

    let headers = {
      'Content-Type': 'application/json',
    }

    headers = cs.password !== ""
      ? { ...headers, Authorization: `Bearer ${createToken(cs.username, cs.password)}` }
      : headers

    return new Request(`${protocol}//${cs.host}${isHyperCloud ? cs.pathname : ''}${'/' + service}${!isHyperCloud ? cs.pathname : ''}`, {
      headers
    })
  }

  /**
   * @param {string} domain
   */
  return function (domain = "default") {
    return {
      data: {
        add: (body) => data.add(body).runWith(buildRequest('data')),
        list: (params) => data.list(params).runWith(buildRequest('data'))
      }
    }
  }
}