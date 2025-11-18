import { useAuth } from '@/lib/auth'
import { useQuery } from '@apollo/client'
import { GET_PERSON_BY_EMAIL } from '@/graphql/person'

/**
 * Hook zum Abrufen der aktuellen Person basierend auf der Keycloak-E-Mail
 * Can be used as default owner for new entities
 */
export const useCurrentPerson = () => {
  const { keycloak, authenticated } = useAuth()

  const userEmail = keycloak?.tokenParsed?.email

  const { data, loading, error } = useQuery(GET_PERSON_BY_EMAIL, {
    variables: { email: userEmail || '' },
    skip: !userEmail || !authenticated,
  })

  const currentPerson = data?.people?.[0] || null

  return {
    currentPerson,
    isLoading: loading,
    error,
    userEmail,
  }
}
