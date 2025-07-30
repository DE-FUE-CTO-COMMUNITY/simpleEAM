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
  const processingRef = useRef(false) // Zusätzlicher Schutz gegen Doppelausführung

  // E-Mail aus Keycloak-Token extrahieren
  useEffect(() => {
    if (authenticated && keycloak?.tokenParsed?.email) {
      const email = keycloak.tokenParsed.email
      setUserEmail(email)
      console.log('🔍 Auto-Registration: E-Mail aus Token extrahiert:', email)

      // Nur prüfen ob gerade eine Erstellung läuft
      const sessionKey = `autoRegChecked_${email}`
      const alreadyChecked = sessionStorage.getItem(sessionKey)
      if (alreadyChecked === 'creating') {
        console.log('🔄 Auto-Registration: Erstellung läuft bereits')
        setIsCreatingUser(true)
        registrationAttempted.current = true
        setRegistrationChecked(false) // Noch nicht abgeschlossen
      } else {
        console.log('🆕 Auto-Registration: Neue Prüfung für:', email)
        // Immer eine neue Prüfung starten - lass GraphQL-Query entscheiden
        setRegistrationChecked(false)
        registrationAttempted.current = false
        setIsCreatingUser(false)
        processingRef.current = false
      }
    } else {
      console.log('❌ Auto-Registration: Keine E-Mail im Token gefunden oder nicht authentifiziert')
    }
  }, [authenticated, keycloak])

  // GraphQL-Abfrage um zu prüfen, ob der Benutzer bereits existiert
  const { data: existingUser, loading: checkingUser } = useQuery(GET_PERSON_BY_EMAIL, {
    variables: { email: userEmail || '' },
    skip: !userEmail || !authenticated || isCreatingUser || registrationAttempted.current,
    onCompleted: data => {
      console.log('🔍 Auto-Registration: GraphQL-Abfrage abgeschlossen:', data)
      // Wenn der Benutzer bereits existiert, markiere als geprüft
      if (data?.people && data.people.length > 0) {
        console.log('✅ Auto-Registration: Benutzer bereits vorhanden')
        setRegistrationChecked(true)
        registrationAttempted.current = true
        // Kein sessionStorage für existierende Benutzer - das blockiert neue Prüfungen
      } else {
        console.log('❌ Auto-Registration: Kein Benutzer gefunden, bereit für Erstellung')
        setRegistrationChecked(true) // Auch hier auf true setzen, damit der Effect triggert
      }
    },
    onError: error => {
      console.error('❌ Fehler beim Überprüfen des Benutzers:', error)
      setRegistrationChecked(true) // Markiere als geprüft, auch bei Fehler
      registrationAttempted.current = true
      // Kein sessionStorage bei Fehlern - das blockiert Retry-Versuche
    },
  })

  // Mutation zum Erstellen eines neuen Benutzers
  const [createPerson] = useMutation(CREATE_PERSON, {
    onCompleted: () => {
      console.log('🎉 Benutzer automatisch in Personen-Tabelle registriert')
      setRegistrationChecked(true)
      setIsCreatingUser(false)
      registrationAttempted.current = true
      processingRef.current = false

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
      processingRef.current = false
      // Entferne creating-Flag bei Fehler
      if (userEmail) {
        sessionStorage.removeItem(`autoRegChecked_${userEmail}`)
      }
    },
    // Verhindere Cache-Updates, die zu erneuten Queries führen könnten
    fetchPolicy: 'no-cache',
  })

  // Stabilisiere die kritischen Werte für die Dependencies
  const userExists = useMemo(() => {
    return existingUser?.people && existingUser.people.length > 0
  }, [existingUser?.people])

  // Vereinfachter Effect - nur noch für den Trigger
  useEffect(() => {
    // Mehrfache Schutzmaßnahmen gegen doppelte Ausführung
    if (registrationAttempted.current || isCreatingUser || processingRef.current) {
      console.log('🛑 Auto-Registration: Gestoppt aufgrund von creation flags')
      return
    }

    // Frühe Prüfung - noch nicht bereit
    if (!initialized || !authenticated || !userEmail || checkingUser || !registrationChecked) {
      console.log('🕐 Auto-Registration: Noch nicht bereit für Prüfung')
      return
    }

    const shouldCreateUser = existingUser?.people && existingUser.people.length === 0

    console.log('🤔 Auto-Registration: Sollte Benutzer erstellt werden?', shouldCreateUser)

    if (shouldCreateUser) {
      console.log('🔄 Erstelle neuen Benutzer automatisch...')

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
        console.log('🔄 Auto-Registration Cache geleert für:', userEmail)
      }
    },
  }
}
