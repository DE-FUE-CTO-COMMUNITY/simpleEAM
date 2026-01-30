import { gql } from '@apollo/client'

export const GET_PERSONS_COUNT = gql`
  query GetPersonsCount($where: PersonWhere) {
    peopleConnection(where: $where) {
      aggregate {
        count {
          nodes
        }
      }
    }
  }
`

export const GET_PERSONS = gql`
  query GetPersons($where: PersonWhere) {
    people(where: $where) {
      id
      firstName
      lastName
      email
      department
      role
      phone
      companies {
        id
        name
        primaryColor
        secondaryColor
        font
        diagramFont
      }
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
      ownedArchitectures {
        id
        name
      }
      ownedDiagrams {
        id
        title
      }
      ownedInfrastructure {
        id
        name
      }
      ownedInterfaces {
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
      companies {
        id
        name
        primaryColor
        secondaryColor
        font
        diagramFont
      }
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
      ownedArchitectures {
        id
        name
      }
      ownedDiagrams {
        id
        title
      }
      ownedInfrastructure {
        id
        name
      }
      ownedInterfaces {
        id
        name
      }
    }
  }
`

export const GET_PERSON_BY_EMAIL = gql`
  query GetPersonByEmail($email: String!) {
    people(where: { email: { eq: $email } }) {
      id
      firstName
      lastName
      email
      department
      role
      phone
      avatarUrl
      companies {
        id
        name
        primaryColor
        secondaryColor
        font
        diagramFont
      }
      createdAt
      updatedAt
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
        companies {
          id
          name
          primaryColor
          secondaryColor
          font
          diagramFont
        }
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
        companies {
          id
          name
          primaryColor
          secondaryColor
          font
          diagramFont
        }
        phone
        avatarUrl
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
