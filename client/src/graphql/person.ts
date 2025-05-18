import { gql } from '@apollo/client'

export const GET_PERSONS_COUNT = gql`
  query GetPersonsCount {
    peopleConnection {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

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
