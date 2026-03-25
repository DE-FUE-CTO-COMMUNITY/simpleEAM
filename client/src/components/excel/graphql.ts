// GraphQL mutations for import/export
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
import {
  CREATE_INFRASTRUCTURE,
  UPDATE_INFRASTRUCTURE,
  CHECK_INFRASTRUCTURE_EXISTS,
  GET_INFRASTRUCTURES_COUNT,
} from '../../graphql/infrastructure'
import {
  CREATE_Aicomponent,
  UPDATE_Aicomponent,
  CHECK_AICOMPONENT_EXISTS,
  GET_AICOMPONENTS_COUNT,
} from '../../graphql/aicomponent'
import {
  CREATE_VISION,
  UPDATE_VISION,
  CHECK_VISION_EXISTS,
  GET_VISIONS,
} from '../../graphql/vision'
import {
  CREATE_MISSION,
  UPDATE_MISSION,
  CHECK_MISSION_EXISTS,
  GET_MISSIONS,
} from '../../graphql/mission'
import { CREATE_VALUE, UPDATE_VALUE, CHECK_VALUE_EXISTS, GET_VALUES } from '../../graphql/value'
import { CREATE_GOAL, UPDATE_GOAL, CHECK_GOAL_EXISTS, GET_GOALS } from '../../graphql/goal'
import {
  CREATE_STRATEGY,
  UPDATE_STRATEGY,
  CHECK_STRATEGY_EXISTS,
  GET_STRATEGIES,
} from '../../graphql/strategy'
import {
  CREATE_BUSINESS_PROCESS,
  UPDATE_BUSINESS_PROCESS,
  CHECK_BUSINESS_PROCESS_EXISTS,
  GET_BUSINESS_PROCESSES_COUNT,
} from '../../graphql/businessProcess'
import {
  CREATE_PRODUCT_FAMILY,
  UPDATE_PRODUCT_FAMILY,
  CHECK_PRODUCT_FAMILY_EXISTS,
} from '../../graphql/productFamily'
import {
  CREATE_SOFTWARE_PRODUCT,
  UPDATE_SOFTWARE_PRODUCT,
  CHECK_SOFTWARE_PRODUCT_EXISTS,
  GET_SOFTWARE_PRODUCTS_COUNT,
} from '../../graphql/softwareProduct'
import {
  CREATE_SOFTWARE_VERSION,
  UPDATE_SOFTWARE_VERSION,
  CHECK_SOFTWARE_VERSION_EXISTS,
  GET_SOFTWARE_VERSIONS_COUNT,
} from '../../graphql/softwareVersion'
import {
  CREATE_HARDWARE_PRODUCT,
  UPDATE_HARDWARE_PRODUCT,
  CHECK_HARDWARE_PRODUCT_EXISTS,
  GET_HARDWARE_PRODUCTS_COUNT,
} from '../../graphql/hardwareProduct'
import {
  CREATE_HARDWARE_VERSION,
  UPDATE_HARDWARE_VERSION,
  CHECK_HARDWARE_VERSION_EXISTS,
  GET_HARDWARE_VERSIONS_COUNT,
} from '../../graphql/hardwareVersion'

// GraphQL mutations for data deletion
export const DELETE_BUSINESS_CAPABILITIES = () => `
  mutation DeleteBusinessCapabilities($where: BusinessCapabilityWhere) {
    deleteBusinessCapabilities(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_APPLICATIONS = () => `
  mutation DeleteApplications($where: ApplicationWhere) {
    deleteApplications(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_DATA_OBJECTS = () => `
  mutation DeleteDataObjects($where: DataObjectWhere) {
    deleteDataObjects(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_INTERFACES = () => `
  mutation DeleteInterfaces($where: ApplicationInterfaceWhere) {
    deleteApplicationInterfaces(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_PERSONS = () => `
  mutation DeletePersons($where: PersonWhere) {
    deletePeople(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_ARCHITECTURES = () => `
  mutation DeleteArchitectures($where: ArchitectureWhere) {
    deleteArchitectures(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_DIAGRAMS = () => `
  mutation DeleteDiagrams($where: DiagramWhere) {
    deleteDiagrams(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_ARCHITECTURE_PRINCIPLES = () => `
  mutation DeleteArchitecturePrinciples($where: ArchitecturePrincipleWhere) {
    deleteArchitecturePrinciples(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_INFRASTRUCTURES = () => `
  mutation DeleteInfrastructures($where: InfrastructureWhere) {
    deleteInfrastructures(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_AICOMPONENTS = () => `
  mutation DeleteAIComponents($where: AIComponentWhere) {
    deleteAiComponents(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_VISIONS = () => `
  mutation DeleteVisions($where: GEA_VisionWhere) {
    deleteGeaVisions(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_MISSIONS = () => `
  mutation DeleteMissions($where: GEA_MissionWhere) {
    deleteGeaMissions(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_VALUES = () => `
  mutation DeleteValues($where: GEA_ValueWhere) {
    deleteGeaValues(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_GOALS = () => `
  mutation DeleteGoals($where: GEA_GoalWhere) {
    deleteGeaGoals(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_STRATEGIES = () => `
  mutation DeleteStrategies($where: GEA_StrategyWhere) {
    deleteGeaStrategies(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_BUSINESS_PROCESSES = () => `
  mutation DeleteBusinessProcesses($where: BusinessProcessWhere) {
    deleteBusinessProcesses(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_PRODUCT_FAMILIES = () => `
  mutation DeleteProductFamilies($where: ProductFamilyWhere) {
    deleteProductFamilies(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_SOFTWARE_PRODUCTS = () => `
  mutation DeleteSoftwareProducts($where: SoftwareProductWhere) {
    deleteSoftwareProducts(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_SOFTWARE_VERSIONS = () => `
  mutation DeleteSoftwareVersions($where: SoftwareVersionWhere) {
    deleteSoftwareVersions(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_HARDWARE_PRODUCTS = () => `
  mutation DeleteHardwareProducts($where: HardwareProductWhere) {
    deleteHardwareProducts(where: $where) {
      nodesDeleted
    }
  }
`

export const DELETE_HARDWARE_VERSIONS = () => `
  mutation DeleteHardwareVersions($where: HardwareVersionWhere) {
    deleteHardwareVersions(where: $where) {
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
    businessProcesses: {
      create: CREATE_BUSINESS_PROCESS,
      update: UPDATE_BUSINESS_PROCESS,
      check: CHECK_BUSINESS_PROCESS_EXISTS,
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
    infrastructures: {
      create: CREATE_INFRASTRUCTURE,
      update: UPDATE_INFRASTRUCTURE,
      check: CHECK_INFRASTRUCTURE_EXISTS,
    },
    aicomponents: {
      create: CREATE_Aicomponent,
      update: UPDATE_Aicomponent,
      check: CHECK_AICOMPONENT_EXISTS,
    },
    visions: {
      create: CREATE_VISION,
      update: UPDATE_VISION,
      check: CHECK_VISION_EXISTS,
    },
    missions: {
      create: CREATE_MISSION,
      update: UPDATE_MISSION,
      check: CHECK_MISSION_EXISTS,
    },
    values: {
      create: CREATE_VALUE,
      update: UPDATE_VALUE,
      check: CHECK_VALUE_EXISTS,
    },
    goals: {
      create: CREATE_GOAL,
      update: UPDATE_GOAL,
      check: CHECK_GOAL_EXISTS,
    },
    strategies: {
      create: CREATE_STRATEGY,
      update: UPDATE_STRATEGY,
      check: CHECK_STRATEGY_EXISTS,
    },
    productFamilies: {
      create: CREATE_PRODUCT_FAMILY,
      update: UPDATE_PRODUCT_FAMILY,
      check: CHECK_PRODUCT_FAMILY_EXISTS,
    },
    softwareProducts: {
      create: CREATE_SOFTWARE_PRODUCT,
      update: UPDATE_SOFTWARE_PRODUCT,
      check: CHECK_SOFTWARE_PRODUCT_EXISTS,
    },
    softwareVersions: {
      create: CREATE_SOFTWARE_VERSION,
      update: UPDATE_SOFTWARE_VERSION,
      check: CHECK_SOFTWARE_VERSION_EXISTS,
    },
    hardwareProducts: {
      create: CREATE_HARDWARE_PRODUCT,
      update: UPDATE_HARDWARE_PRODUCT,
      check: CHECK_HARDWARE_PRODUCT_EXISTS,
    },
    hardwareVersions: {
      create: CREATE_HARDWARE_VERSION,
      update: UPDATE_HARDWARE_VERSION,
      check: CHECK_HARDWARE_VERSION_EXISTS,
    },
  }

  return mutationMap[entityType as keyof typeof mutationMap]
}

// Helper function: Returns the appropriate DELETE mutation for an entity type
export const getDeleteMutationByEntityType = (entityType: string) => {
  const deleteMutationMap = {
    businessCapabilities: DELETE_BUSINESS_CAPABILITIES(),
    businessProcesses: DELETE_BUSINESS_PROCESSES(),
    applications: DELETE_APPLICATIONS(),
    dataObjects: DELETE_DATA_OBJECTS(),
    interfaces: DELETE_INTERFACES(),
    persons: DELETE_PERSONS(),
    architectures: DELETE_ARCHITECTURES(),
    diagrams: DELETE_DIAGRAMS(),
    architecturePrinciples: DELETE_ARCHITECTURE_PRINCIPLES(),
    infrastructures: DELETE_INFRASTRUCTURES(),
    aicomponents: DELETE_AICOMPONENTS(),
    visions: DELETE_VISIONS(),
    missions: DELETE_MISSIONS(),
    values: DELETE_VALUES(),
    goals: DELETE_GOALS(),
    strategies: DELETE_STRATEGIES(),
    productFamilies: DELETE_PRODUCT_FAMILIES(),
    softwareProducts: DELETE_SOFTWARE_PRODUCTS(),
    softwareVersions: DELETE_SOFTWARE_VERSIONS(),
    hardwareProducts: DELETE_HARDWARE_PRODUCTS(),
    hardwareVersions: DELETE_HARDWARE_VERSIONS(),
  }

  return deleteMutationMap[entityType as keyof typeof deleteMutationMap]
}

// Alle GraphQL-Operationen für direkten Import
export {
  CREATE_CAPABILITY,
  UPDATE_CAPABILITY,
  CHECK_CAPABILITY_EXISTS,
  GET_CAPABILITIES_COUNT,
  CREATE_BUSINESS_PROCESS,
  UPDATE_BUSINESS_PROCESS,
  CHECK_BUSINESS_PROCESS_EXISTS,
  GET_BUSINESS_PROCESSES_COUNT,
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
  CREATE_INFRASTRUCTURE,
  UPDATE_INFRASTRUCTURE,
  CHECK_INFRASTRUCTURE_EXISTS,
  GET_INFRASTRUCTURES_COUNT,
  CREATE_Aicomponent,
  UPDATE_Aicomponent,
  CHECK_AICOMPONENT_EXISTS,
  GET_AICOMPONENTS_COUNT,
  CREATE_VISION,
  UPDATE_VISION,
  CHECK_VISION_EXISTS,
  GET_VISIONS,
  CREATE_MISSION,
  UPDATE_MISSION,
  CHECK_MISSION_EXISTS,
  GET_MISSIONS,
  CREATE_VALUE,
  UPDATE_VALUE,
  CHECK_VALUE_EXISTS,
  GET_VALUES,
  CREATE_GOAL,
  UPDATE_GOAL,
  CHECK_GOAL_EXISTS,
  GET_GOALS,
  CREATE_STRATEGY,
  UPDATE_STRATEGY,
  CHECK_STRATEGY_EXISTS,
  GET_STRATEGIES,
  CREATE_PRODUCT_FAMILY,
  UPDATE_PRODUCT_FAMILY,
  CHECK_PRODUCT_FAMILY_EXISTS,
  CREATE_SOFTWARE_PRODUCT,
  UPDATE_SOFTWARE_PRODUCT,
  CHECK_SOFTWARE_PRODUCT_EXISTS,
  GET_SOFTWARE_PRODUCTS_COUNT,
  CREATE_SOFTWARE_VERSION,
  UPDATE_SOFTWARE_VERSION,
  CHECK_SOFTWARE_VERSION_EXISTS,
  GET_SOFTWARE_VERSIONS_COUNT,
  CREATE_HARDWARE_PRODUCT,
  UPDATE_HARDWARE_PRODUCT,
  CHECK_HARDWARE_PRODUCT_EXISTS,
  GET_HARDWARE_PRODUCTS_COUNT,
  CREATE_HARDWARE_VERSION,
  UPDATE_HARDWARE_VERSION,
  CHECK_HARDWARE_VERSION_EXISTS,
  GET_HARDWARE_VERSIONS_COUNT,
}
