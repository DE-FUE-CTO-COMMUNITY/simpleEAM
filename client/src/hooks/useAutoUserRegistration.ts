import { useEffect, useState, useRef, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PERSON_BY_EMAIL, CREATE_PERSON } from '@/graphql/person'
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

  // E-Mail aus Keycloak-Token extrahieren
  useEffect(() => {
    if (authenticated && keycloak?.tokenParsed?.email) {
      const email = keycloak.tokenParsed.email
      setUserEmail(email)

      // Prüfe ob für diese E-Mail bereits eine Registrierung versucht wurde
      const sessionKey = `autoRegChecked_${email}`
      const alreadyChecked = sessionStorage.getItem(sessionKey)
      if (alreadyChecked) {
        setRegistrationChecked(true)
        registrationAttempted.current = true
      }
    }
  }, [authenticated, keycloak])

  // GraphQL-Abfrage um zu prüfen, ob der Benutzer bereits existiert
  const { data: existingUser, loading: checkingUser } = useQuery(GET_PERSON_BY_EMAIL, {
    variables: { email: userEmail || '' },
    skip: !userEmail || !authenticated || registrationChecked || isCreatingUser,
    onCompleted: data => {
      // Wenn der Benutzer bereits existiert, markiere als geprüft
      if (data?.people && data.people.length > 0) {
        setRegistrationChecked(true)
        registrationAttempted.current = true

        // Speichere in sessionStorage für diese Session
        if (userEmail) {
          sessionStorage.setItem(`autoRegChecked_${userEmail}`, 'true')
        }
      }
    },
    onError: error => {
      console.error('❌ Fehler beim Überprüfen des Benutzers:', error)
      setRegistrationChecked(true) // Markiere als geprüft, auch bei Fehler
      registrationAttempted.current = true

      // Speichere in sessionStorage auch bei Fehler
      if (userEmail) {
        sessionStorage.setItem(`autoRegChecked_${userEmail}`, 'true')
      }
    },
  })

  // Mutation zum Erstellen eines neuen Benutzers
  const [createPerson] = useMutation(CREATE_PERSON, {
    onCompleted: () => {
      console.log('🎉 Benutzer automatisch in Personen-Tabelle registriert')
      setRegistrationChecked(true)
      setIsCreatingUser(false)
      registrationAttempted.current = true

      // Speichere in sessionStorage dass Registrierung abgeschlossen ist
      if (userEmail) {
        sessionStorage.setItem(`autoRegChecked_${userEmail}`, 'true')
      }
    },
    onError: error => {
      console.error('❌ Fehler bei der automatischen Benutzerregistrierung:', error)
      setRegistrationChecked(true) // Markiere als geprüft, auch bei Fehler
      setIsCreatingUser(false)
      registrationAttempted.current = true

      // Speichere in sessionStorage auch bei Fehler
      if (userEmail) {
        sessionStorage.setItem(`autoRegChecked_${userEmail}`, 'true')
      }
    },
  })

  // Stabilisiere die kritischen Werte für die Dependencies
  const userExists = useMemo(() => {
    return existingUser?.people && existingUser.people.length > 0
  }, [existingUser?.people])

  const tokenEmail = useMemo(() => {
    return keycloak?.tokenParsed?.email
  }, [keycloak?.tokenParsed?.email])

  // Automatische Registrierung durchführen - verhindert doppelte Ausführung
  useEffect(() => {
    // Mehrfache Schutzmaßnahmen gegen doppelte Ausführung
    if (registrationAttempted.current || isCreatingUser || registrationChecked) {
      return
    }

    const shouldCreateUser =
      initialized &&
      authenticated &&
      userEmail &&
      !checkingUser &&
      !registrationChecked &&
      !isCreatingUser &&
      existingUser?.people &&
      existingUser.people.length === 0 // Benutzer existiert noch nicht

    if (shouldCreateUser) {
      console.log('🔄 Erstelle neuen Benutzer automatisch...')

      // Setze alle Flags um doppelte Ausführung zu verhindern
      registrationAttempted.current = true
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
              // Optional: Weitere Felder können hier gesetzt werden
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

        // Markiere auch bei Catch-Fehler in sessionStorage
        if (userEmail) {
          sessionStorage.setItem(`autoRegChecked_${userEmail}`, 'true')
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
    userExists, // Verwende stabilisierten Wert
    tokenEmail, // Verwende stabilisierten Wert
    createPerson,
    existingUser?.people, // Füge das explizit hinzu
    keycloak?.tokenParsed, // Füge das explizit hinzu
  ])

  return {
    registrationChecked,
    userExists,
    isChecking: checkingUser,
    isCreating: isCreatingUser,
  }
}
