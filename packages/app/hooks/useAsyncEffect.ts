import React, { DependencyList, useEffect } from 'react'

export default (effect: () => Promise<any>, deps?: DependencyList) => {
  useEffect(() => {
    effect().catch(e => console.warn('useAsyncEffect error', e))
  }, deps)
}
