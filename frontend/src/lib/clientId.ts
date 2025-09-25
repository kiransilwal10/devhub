import { v4 as uuidv4 } from "uuid"

const CLIENT_ID_KEY = "devhub_client_id"

/**
 * Get or generate a stable client ID for the current user
 * This ID is stored in localStorage and persists across sessions
 */
export function getClientId(): string {
  let clientId = localStorage.getItem(CLIENT_ID_KEY)

  if (!clientId) {
    clientId = uuidv4()
    localStorage.setItem(CLIENT_ID_KEY, clientId)
  }

  return clientId
}

/**
 * Clear the stored client ID (useful for logout or reset)
 */
export function clearClientId(): void {
  localStorage.removeItem(CLIENT_ID_KEY)
}

/**
 * Set a specific client ID (useful for testing or migration)
 */
export function setClientId(id: string): void {
  localStorage.setItem(CLIENT_ID_KEY, id)
}
