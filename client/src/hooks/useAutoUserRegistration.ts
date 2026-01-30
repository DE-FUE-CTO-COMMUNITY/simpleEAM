import { useEffect, useState, useRef, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PERSON_BY_EMAIL, CREATE_PERSON, GET_PERSONS_COUNT } from '@/graphql/person'
import { useAuth } from '@/lib/auth'

/**
 * Hook für die automatische Benutzerregistrierung
 * Überprüft beim Login, ob der Benutzer bereits in der Personen-Tabelle existiert
 * Wenn nicht, wird automatisch ein neuer Eintrag erstellt
 */
export const useAutoUserRegistration = () => {
  const { keycloak, authenticated, initialized } = useAuth()
  const [registrationChecked, setRegistrationChecked] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const registrationAttempted = useRef(false)
  const processingRef = useRef(false) // Additional protection against double execution

  // Extract email from Keycloak token
  useEffect(() => {
    if (authenticated && keycloak?.tokenParsed?.email) {
      const email = keycloak.tokenParsed.email
      setUserEmail(email)
      // Only check if creation is currently running
      const sessionKey = `autoRegChecked_${email}`
      const alreadyChecked = sessionStorage.getItem(sessionKey)
      if (alreadyChecked === 'creating') {
        setIsCreatingUser(true)
        registrationAttempted.current = true
        setRegistrationChecked(false) // Noch nicht abgeschlossen
      } else {
        // Always start a new check - let GraphQL query decide
        setRegistrationChecked(false)
        registrationAttempted.current = false
        setIsCreatingUser(false)
        processingRef.current = false
      }
    } else {
      console.error(
        '❌ Auto-Registration: Keine E-Mail im Token gefunden oder nicht authentifiziert'
      )
    }
  }, [authenticated, keycloak])

  // GraphQL query to check, ob der Benutzer bereits existiert
  const { data: existingUser, loading: checkingUser } = useQuery(GET_PERSON_BY_EMAIL, {
    variables: { email: userEmail || '' },
    skip: !userEmail || !authenticated || isCreatingUser || registrationAttempted.current,
    onCompleted: data => {
      // If user already exists, mark as checked
      if (data?.people && data.people.length > 0) {
        setRegistrationChecked(true)
        registrationAttempted.current = true
        // No sessionStorage for existing users - this blocks new checks
      } else {
        setRegistrationChecked(true) // Also set to true here so the effect triggers
      }
    },
    onError: error => {
      console.error('❌ Fehler beim Überprüfen des Benutzers:', error)
      setRegistrationChecked(true) // Mark as checked, even on error
      registrationAttempted.current = true
      // No sessionStorage on errors - this blocks retry attempts
    },
  })

  // Mutation to create a new user
  const [createPerson] = useMutation(CREATE_PERSON, {
    onCompleted: () => {
      setRegistrationChecked(true)
      setIsCreatingUser(false)
      registrationAttempted.current = true
      processingRef.current = false

      // Save in sessionStorage that registration is complete
      if (userEmail) {
        sessionStorage.setItem(`autoRegChecked_${userEmail}`, 'true')
      }
    },
    onError: error => {
      console.error('❌ Fehler bei der automatischen Benutzerregistrierung:', error)
      setRegistrationChecked(true) // Mark as checked, even on error
      setIsCreatingUser(false)
      registrationAttempted.current = true
      processingRef.current = false
      // Entferne creating-Flag bei Fehler
      if (userEmail) {
        sessionStorage.removeItem(`autoRegChecked_${userEmail}`)
      }
    },
    // Verhindere Cache-Updates, die zu erneuten Queries führen könnten
    fetchPolicy: 'no-cache',
    // Aktualisiere alle relevanten Queries nach der Erstellung
    refetchQueries: [{ query: GET_PERSONS_COUNT }],
  })

  // Stabilisiere die kritischen Werte für die Dependencies
  const userExists = useMemo(() => {
    return existingUser?.people && existingUser.people.length > 0
  }, [existingUser?.people])

  // Vereinfachter Effect - nur noch für den Trigger
  useEffect(() => {
    // Mehrfache Schutzmaßnahmen gegen doppelte Ausführung
    if (registrationAttempted.current || isCreatingUser || processingRef.current) {
      return
    }

    // Frühe Prüfung - noch nicht bereit
    if (!initialized || !authenticated || !userEmail || checkingUser || !registrationChecked) {
      return
    }

    const shouldCreateUser = existingUser?.people && existingUser.people.length === 0

    if (shouldCreateUser) {
      // Setze alle Flags um doppelte Ausführung zu verhindern
      registrationAttempted.current = true
      processingRef.current = true
      setIsCreatingUser(true)

      // Markiere sofort in sessionStorage
      if (userEmail) {
        sessionStorage.setItem(`autoRegChecked_${userEmail}`, 'creating')
      }

      // Benutzerdaten aus Keycloak-Token extrahieren
      const tokenParsed = keycloak?.tokenParsed
      const firstName = tokenParsed?.given_name || ''
      const lastName = tokenParsed?.family_name || ''
      const email = tokenParsed?.email || userEmail

      // Neuen Benutzer erstellen
      createPerson({
        variables: {
          input: [
            {
              firstName,
              lastName,
              email,
              // Optional: Additional fields can be set here
              department: null,
              role: null,
              phone: null,
            },
          ],
        },
      }).catch(error => {
        console.error('🚨 Unerwarteter Fehler bei der Benutzerregistrierung:', error)
        setIsCreatingUser(false)
        setRegistrationChecked(true)
        processingRef.current = false

        // Entferne creating-Flag bei Catch-Fehler
        if (userEmail) {
          sessionStorage.removeItem(`autoRegChecked_${userEmail}`)
        }
      })
    }
  }, [
    initialized,
    authenticated,
    userEmail,
    checkingUser,
    registrationChecked,
    isCreatingUser,
    existingUser?.people,
    createPerson,
    keycloak?.tokenParsed,
  ])

  return {
    registrationChecked,
    userExists,
    isChecking: checkingUser,
    isCreating: isCreatingUser,
    // Debug-Funktionen
    clearRegistrationCache: () => {
      if (userEmail) {
        const sessionKey = `autoRegChecked_${userEmail}`
        sessionStorage.removeItem(sessionKey)
        setRegistrationChecked(false)
        registrationAttempted.current = false
        setIsCreatingUser(false)
      }
    },
  }
}
