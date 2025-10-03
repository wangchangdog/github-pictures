/* eslint-disable unicorn/prefer-export-from */

import Prism from 'prismjs'

if (typeof globalThis !== 'undefined') {
  const globalWithPrism = globalThis as typeof globalThis & { Prism?: typeof Prism }
  if (!globalWithPrism.Prism) {
    globalWithPrism.Prism = Prism
  }
}

export default Prism
