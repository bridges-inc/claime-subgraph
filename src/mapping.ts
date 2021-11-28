import { dataSource } from '@graphprotocol/graph-ts'
import { ClaimRemoved, ClaimUpdated } from '../generated/Claime/Claime'
import { Claim } from '../generated/schema'

const DELIMITER = '|'

export function handleClaimRemoved(event: ClaimRemoved): void {
  const claimId = idFromRemovedEvent(event)
  const claim = Claim.load(claimId)
  if (!claim) return
  claim.removed = true
  claim.save()
}

export function handleClaimUpdated(event: ClaimUpdated): void {
  const claimer = event.params.claimer
  const data = event.params.claim
  const claimId = idFromUpdatedEvent(event)
  let claim = Claim.load(claimId)
  if (claim == null) {
    claim = new Claim(claimId)
  }
  claim.propoertyId = data.propertyId
  claim.propertyType = data.propertyType
  claim.method = data.method
  claim.evidence = data.evidence
  claim.claimer = claimer
  claim.removed = false
  claim.save()
}

function idFromRemovedEvent(event: ClaimRemoved): string {
  const claimer = event.params.claimer
  const data = event.params.claim
  return [
    dataSource.network(),
    claimer.toHexString(),
    data.propertyId,
    data.propertyType,
    data.method,
  ].join(DELIMITER)
}

function idFromUpdatedEvent(event: ClaimUpdated): string {
  const claimer = event.params.claimer
  const data = event.params.claim
  return [
    dataSource.network(),
    claimer.toHexString(),
    data.propertyId,
    data.propertyType,
    data.method,
  ].join(DELIMITER)
}
