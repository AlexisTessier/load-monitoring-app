import { LoadingData } from '../../../components/loading-data'

test('snapshot', () => {
  expect(LoadingData()).toMatchSnapshot()
})
