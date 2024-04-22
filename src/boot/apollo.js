import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache /*, createHttpLink */
} from '@apollo/client/core'
import {provideApolloClient} from '@vue/apollo-composable'
import {Notify, SessionStorage} from "quasar";
import { onError } from '@apollo/client/link/error'
import { notifyError } from '../js/GQL.js'
import {ignoreAuthPathNames} from "src/router";


export default ({ app, router, store }) => {

  let httpLink = createHttpLink({
    uri: 'https://emission-tracker-13da3ed8dfae.herokuapp.com/graphql',
    //uri: 'http://localhost:8080/graphql',
  })

  const errorLink = onError((errorResponse) => {

    /*
    if (errorResponse.graphQLErrors) {
      console.log(errorResponse.graphQLErrors)
      if (errorResponse.graphQLErrors.some(e => e.extensions.classification === "ValidationError")) {
        router.push('/auth')
        return;
      }
    }*/

    if (errorResponse.networkError && !ignoreAuthPathNames.includes(router.currentRoute.value.name)) {
      if (errorResponse.networkError.message.includes("403"))
        router.push('/auth')
      else
        notifyError(errorResponse.networkError.message)
    }

    if (errorResponse.response  && !ignoreAuthPathNames.includes(router.currentRoute.value.name))
      errorResponse.response.errors.forEach(({message}) => {
        if (message.includes("Access Denied"))
          router.push('/auth')

        notifyError(message)
      })
  })

  const authMiddleware = new ApolloLink((operation, forward) => {

    if (operation.operationName !== "login" && operation.operationName !== "register") {

      const token = SessionStorage.getItem('jwt-token');

      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      });
    }

    return forward(operation);
  });

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(authMiddleware, errorLink.concat(httpLink)),
  })

  provideApolloClient(apolloClient);
}


