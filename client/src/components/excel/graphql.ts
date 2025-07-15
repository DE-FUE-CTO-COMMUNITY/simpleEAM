// GraphQL Mutations für Import/Export
import {
  CREATE_CAPABILITY,
  UPDATE_CAPABILITY,
  CHECK_CAPABILITY_EXISTS,
  GET_CAPABILITIES_COUNT,
} from '../../graphql/capability'
import {
  CREATE_APPLICATION,
  UPDATE_APPLICATION,
  CHECK_APPLICATION_EXISTS,
  GET_APPLICATIONS_COUNT,
} from '../../graphql/application'
import {
  CREATE_APPLICATION_INTERFACE,
  UPDATE_APPLICATION_INTERFACE,
  CHECK_APPLICATION_INTERFACE_EXISTS,
  GET_APPLICATION_INTERFACES_COUNT,
} from '../../graphql/applicationInterface'
import {
  CREATE_DATA_OBJECT,
  UPDATE_DATA_OBJECT,
  CHECK_DATA_OBJECT_EXISTS,
  GET_DATA_OBJECTS_COUNT,
} from '../../graphql/dataObject'
import {
  CREATE_PERSON,
  UPDATE_PERSON,
  CHECK_PERSON_EXISTS,
  GET_PERSONS_COUNT,
} from '../../graphql/person'
import {
  CREATE_ARCHITECTURE,
  UPDATE_ARCHITECTURE,
  CHECK_ARCHITECTURE_EXISTS,
  GET_ARCHITECTURES_COUNT,
} from '../../graphql/architecture'
import {
  CREATE_DIAGRAM,
  UPDATE_DIAGRAM,
  CHECK_DIAGRAM_EXISTS,
  GET_DIAGRAMS_COUNT,
} from '../../graphql/diagram'
import {
  CREATE_ARCHITECTURE_PRINCIPLE,
  UPDATE_ARCHITECTURE_PRINCIPLE,
  CHECK_ARCHITECTURE_PRINCIPLE_EXISTS,
  GET_ARCHITECTURE_PRINCIPLES_COUNT,
} from '../../graphql/architecturePrinciple'

// GraphQL Mutations für Datenlöschung
export const DELETE_BUSINESS_CAPABILITIES = `
  mutation DeleteAllBusinessCapabilities {
    deleteBusinessCapabilities(where: {}) {
      nodesDeleted
    }
  }
`

export const DELETE_APPLICATIONS = `
  mutation DeleteAllApplications {
    deleteApplications(where: {}) {
      nodesDeleted
    }
  }
`

export const DELETE_DATA_OBJECTS = `
  mutation DeleteAllDataObjects {
    deleteDataObjects(where: {}) {
      nodesDeleted
    }
  }
`

export const DELETE_INTERFACES = `
  mutation DeleteAllInterfaces {
    deleteApplicationInterfaces(where: {}) {
      nodesDeleted
    }
  }
`

export const DELETE_PERSONS = `
  mutation DeleteAllPersons {
    deletePeople(where: {}) {
      nodesDeleted
    }
  }
`

export const DELETE_ARCHITECTURES = `
  mutation DeleteAllArchitectures {
    deleteArchitectures(where: {}) {
      nodesDeleted
    }
  }
`

export const DELETE_DIAGRAMS = `
  mutation DeleteAllDiagrams {
    deleteDiagrams(where: {}) {
      nodesDeleted
    }
  }
`

export const DELETE_ARCHITECTURE_PRINCIPLES = `
  mutation DeleteAllArchitecturePrinciples {
    deleteArchitecturePrinciples(where: {}) {
      nodesDeleted
    }
  }
`

// Helper-Funktion: Gibt die passenden CREATE/UPDATE Mutations für einen Entity-Type zurück
export const getMutationsByEntityType = (entityType: string) => {
  const mutationMap = {
    businessCapabilities: {
      create: CREATE_CAPABILITY,
      update: UPDATE_CAPABILITY,
      check: CHECK_CAPABILITY_EXISTS,
    },
    applications: {
      create: CREATE_APPLICATION,
      update: UPDATE_APPLICATION,
      check: CHECK_APPLICATION_EXISTS,
    },
    dataObjects: {
      create: CREATE_DATA_OBJECT,
      update: UPDATE_DATA_OBJECT,
      check: CHECK_DATA_OBJECT_EXISTS,
    },
    interfaces: {
      create: CREATE_APPLICATION_INTERFACE,
      update: UPDATE_APPLICATION_INTERFACE,
      check: CHECK_APPLICATION_INTERFACE_EXISTS,
    },
    persons: {
      create: CREATE_PERSON,
      update: UPDATE_PERSON,
      check: CHECK_PERSON_EXISTS,
    },
    architectures: {
      create: CREATE_ARCHITECTURE,
      update: UPDATE_ARCHITECTURE,
      check: CHECK_ARCHITECTURE_EXISTS,
    },
    diagrams: {
      create: CREATE_DIAGRAM,
      update: UPDATE_DIAGRAM,
      check: CHECK_DIAGRAM_EXISTS,
    },
    architecturePrinciples: {
      create: CREATE_ARCHITECTURE_PRINCIPLE,
      update: UPDATE_ARCHITECTURE_PRINCIPLE,
      check: CHECK_ARCHITECTURE_PRINCIPLE_EXISTS,
    },
  }

  return mutationMap[entityType as keyof typeof mutationMap]
}

// Helper-Funktion: Gibt die passende DELETE Mutation für einen Entity-Type zurück
export const getDeleteMutationByEntityType = (entityType: string) => {
  const deleteMutationMap = {
    businessCapabilities: DELETE_BUSINESS_CAPABILITIES,
    applications: DELETE_APPLICATIONS,
    dataObjects: DELETE_DATA_OBJECTS,
    interfaces: DELETE_INTERFACES,
    persons: DELETE_PERSONS,
    architectures: DELETE_ARCHITECTURES,
    diagrams: DELETE_DIAGRAMS,
    architecturePrinciples: DELETE_ARCHITECTURE_PRINCIPLES,
  }

  return deleteMutationMap[entityType as keyof typeof deleteMutationMap]
}

// Alle GraphQL-Operationen für direkten Import
export {
  CREATE_CAPABILITY,
  UPDATE_CAPABILITY,
  CHECK_CAPABILITY_EXISTS,
  GET_CAPABILITIES_COUNT,
  CREATE_APPLICATION,
  UPDATE_APPLICATION,
  CHECK_APPLICATION_EXISTS,
  GET_APPLICATIONS_COUNT,
  CREATE_APPLICATION_INTERFACE,
  UPDATE_APPLICATION_INTERFACE,
  CHECK_APPLICATION_INTERFACE_EXISTS,
  GET_APPLICATION_INTERFACES_COUNT,
  CREATE_DATA_OBJECT,
  UPDATE_DATA_OBJECT,
  CHECK_DATA_OBJECT_EXISTS,
  GET_DATA_OBJECTS_COUNT,
  CREATE_PERSON,
  UPDATE_PERSON,
  CHECK_PERSON_EXISTS,
  GET_PERSONS_COUNT,
  CREATE_ARCHITECTURE,
  UPDATE_ARCHITECTURE,
  CHECK_ARCHITECTURE_EXISTS,
  GET_ARCHITECTURES_COUNT,
  CREATE_DIAGRAM,
  UPDATE_DIAGRAM,
  CHECK_DIAGRAM_EXISTS,
  GET_DIAGRAMS_COUNT,
  CREATE_ARCHITECTURE_PRINCIPLE,
  UPDATE_ARCHITECTURE_PRINCIPLE,
  CHECK_ARCHITECTURE_PRINCIPLE_EXISTS,
  GET_ARCHITECTURE_PRINCIPLES_COUNT,
}
