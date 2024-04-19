import {useMutation} from "@vue/apollo-composable";
import {gql} from "@apollo/client/core";

export const LOGIN = gql(`
      mutation register ($email: String, $password: String) {
        login(
          credentialsInputDto : {
            email:$email, password:$password
           })
      }
    `)

export const REGISTER = gql(`
      mutation register ($username: String, $email: String, $password: String) {
        register(
          userDto : {
            email:$email, username: $username, password:$password
           })
        {
          username
        }
      }
    `)
