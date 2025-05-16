import { gql } from '@apollo/client'

export const GET_PERSONS = gql`
  query GetPersons {
    people {
      id
      firstName
      lastName
      email
      department
      role
    }
  }
`
