import { gql } from '@apollo/client'

// Query um alle Personen zu holen
export const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
      email
      phone
      role
      department
      avatarUrl
      createdAt
      updatedAt
    }
  }
`

// Query um eine spezifische Person zu holen
export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    people(where: { id: $id }) {
      id
      firstName
      lastName
      email
      phone
      role
      department
      avatarUrl
      createdAt
      updatedAt
    }
  }
`

// Mutation um eine neue Person zu erstellen
export const CREATE_PERSON = gql`
  mutation CreatePerson($input: [PersonCreateInput!]!) {
    createPeople(input: $input) {
      people {
        id
        firstName
        lastName
        email
        phone
        role
        department
        avatarUrl
        createdAt
        updatedAt
      }
      info {
        nodesCreated
        relationshipsCreated
      }
    }
  }
`

// Mutation um eine Person zu aktualisieren
export const UPDATE_PERSON = gql`
  mutation UpdatePerson($where: PersonWhere!, $update: PersonUpdateInput!) {
    updatePeople(where: $where, update: $update) {
      people {
        id
        firstName
        lastName
        email
        phone
        role
        department
        avatarUrl
        createdAt
        updatedAt
      }
      info {
        nodesCreated
        nodesDeleted
      }
    }
  }
`

// Mutation um eine Person zu löschen
export const DELETE_PERSON = gql`
  mutation DeletePerson($where: PersonWhere!) {
    deletePeople(where: $where) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`
