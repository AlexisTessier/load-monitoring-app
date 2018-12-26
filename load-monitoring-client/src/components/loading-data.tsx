import React, { ReactElement } from 'react'

import styled from 'styled-components'

const Root = styled.div`
	text-align: center;
`

export function LoadingData(): ReactElement<void> {
  return <Root>Loading data...</Root>
}
