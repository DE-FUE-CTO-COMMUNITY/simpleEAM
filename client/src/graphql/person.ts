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
      phone
      createdAt
      updatedAt
      ownedCapabilities {
        id
        name
      }
      ownedApplications {
        id
        name
      }
      ownedDataObjects {
        id
        name
      }
    }
  }
`

export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    person(where: { id: $id }) {
      id
      firstName
      lastName
      email
      department
      role
      phone
      createdAt
      updatedAt
      ownedCapabilities {
        id
        name
      }
      ownedApplications {
        id
        name
      }
      ownedDataObjects {
        id
        name
      }
    }
  }
`

export const CREATE_PERSON = gql`
  mutation CreatePerson($input: [PersonCreateInput!]!) {
    createPeople(input: $input) {
      people {
        id
        firstName
        lastName
        email
        department
        role
        phone
        createdAt
      }
    }
  }
`

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $input: PersonUpdateInput!) {
    updatePeople(where: { id: { eq: $id } }, update: $input) {
      people {
        id
        firstName
        lastName
        email
        department
        role
        phone
        updatedAt
      }
    }
  }
`

export const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePeople(where: { id: { eq: $id } }) {
      nodesDeleted
    }
  }
`

export const CHECK_PERSON_EXISTS = gql`
  query CheckPersonExists($id: ID!) {
    people(where: { id: { eq: $id } }) {
      id
    }
  }
`
