import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Nicht authentifiziert' }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Decrypt token to get user information
    const tokenPayload = JSON.parse(atob(token.split('.')[1]))
    const userEmail = tokenPayload.email

    if (!userEmail) {
      return NextResponse.json({ message: 'E-Mail nicht im Token gefunden' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json({ message: 'Keine Datei hochgeladen' }, { status: 400 })
    }

    // Check file size (max 2MB für komprimierte Bilder)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: 'Komprimierte Datei ist immer noch zu groß. Maximum: 2MB',
        },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Ungültiger Dateityp. Erlaubt: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    // Konvertiere Datei zu Base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = buffer.toString('base64')

    // Additional size check for Base64-String
    if (base64String.length > 1500000) {
      // ~1.5MB Base64
      return NextResponse.json(
        { success: false, message: 'Base64-Daten zu groß für GraphQL-Server' },
        { status: 413 }
      )
    }

    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64String}`

    // GraphQL mutation via internal API call
    const graphqlEndpoint = process.env.GRAPHQL_URL || 'http://localhost:4000/graphql'

    const updateMutation = `
      mutation UpdatePersonAvatar($email: String!, $avatarUrl: String!) {
        updatePeople(
          where: { email: { eq: $email } }
          update: { avatarUrl: { set: $avatarUrl } }
        ) {
          people {
            id
            email
            avatarUrl
          }
        }
      }
    `

    const graphqlResponse = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: updateMutation,
        variables: {
          email: userEmail,
          avatarUrl: dataUrl,
        },
      }),
    })

    if (!graphqlResponse.ok) {
      const errorText = await graphqlResponse.text()
      console.error('GraphQL HTTP-Fehler:', {
        status: graphqlResponse.status,
        statusText: graphqlResponse.statusText,
        response: errorText,
      })
      return NextResponse.json(
        { message: 'Fehler beim Speichern des Avatars - HTTP Fehler', details: errorText },
        { status: 500 }
      )
    }

    const graphqlResult = await graphqlResponse.json()

    if (graphqlResult.errors) {
      console.error('GraphQL-Errors:', graphqlResult.errors)
      return NextResponse.json(
        {
          message: 'Fehler beim Speichern des Avatars - GraphQL Fehler',
          errors: graphqlResult.errors,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Avatar erfolgreich hochgeladen',
      avatarUrl: dataUrl,
      success: true,
    })
  } catch (error) {
    console.error('Fehler beim Avatar-Upload:', error)
    return NextResponse.json({ message: 'Fehler beim Avatar-Upload' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Nicht authentifiziert' }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Decrypt token to get user information
    const tokenPayload = JSON.parse(atob(token.split('.')[1]))
    const userEmail = tokenPayload.email

    if (!userEmail) {
      return NextResponse.json({ message: 'E-Mail nicht im Token gefunden' }, { status: 400 })
    }

    // GraphQL mutation to delete the Avatars
    const graphqlEndpoint = process.env.GRAPHQL_URL || 'http://localhost:4000/graphql'

    const deleteMutation = `
      mutation DeletePersonAvatar($email: String!) {
        updatePeople(
          where: { email: { eq: $email } }
          update: { avatarUrl: { set: null } }
        ) {
          people {
            id
            email
            avatarUrl
          }
        }
      }
    `

    const graphqlResponse = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: deleteMutation,
        variables: {
          email: userEmail,
        },
      }),
    })

    if (!graphqlResponse.ok) {
      const errorText = await graphqlResponse.text()
      console.error('GraphQL-Fehler:', errorText)
      return NextResponse.json({ message: 'Fehler beim Löschen des Avatars' }, { status: 500 })
    }

    const graphqlResult = await graphqlResponse.json()

    if (graphqlResult.errors) {
      console.error('GraphQL-Errors:', graphqlResult.errors)
      return NextResponse.json({ message: 'Fehler beim Löschen des Avatars' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Avatar erfolgreich gelöscht',
      success: true,
    })
  } catch (error) {
    console.error('Fehler beim Avatar-Löschen:', error)
    return NextResponse.json({ message: 'Fehler beim Avatar-Löschen' }, { status: 500 })
  }
}
