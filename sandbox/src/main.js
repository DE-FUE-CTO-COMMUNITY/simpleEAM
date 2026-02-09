import { ApolloSandbox } from '@apollo/sandbox'
import './styles.css'

const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://api.dev-server.mf2.eu/graphql'

new ApolloSandbox({
  target: '#sandbox',
  initialEndpoint: endpoint,
  endpointIsEditable: true,
  hideCookieToggle: false,
  initialState: {
    includeCookies: false,
  },
})
