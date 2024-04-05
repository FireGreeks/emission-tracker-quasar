import {ApolloClient, createHttpLink, InMemoryCache /*, createHttpLink */} from '@apollo/client/core'
import {provideApolloClient} from '@vue/apollo-composable'
import {useQuasar} from "quasar";
import { onError } from '@apollo/client/link/error'

export default ({ app, router, store }) => {
  let httpLink = createHttpLink({
    //uri: 'https://emission-tracker-13da3ed8dfae.herokuapp.com/graphql',
    uri: 'http://localhost:8080/graphql',
  })


  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      )

    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(httpLink),
  })

  provideApolloClient(apolloClient)

}
