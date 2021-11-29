import { dataSource } from '@graphprotocol/graph-ts'
import { ClaimRemoved, ClaimUpdated } from '../generated/Claime/Claime'
import { Claim } from '../generated/schema'

const DELIMITER = '|'

export function handleClaimRemoved(event: ClaimRemoved): void {
  const claimId = idFromRemovedEvent(dataSource.network(), event)
  const claim = Claim.load(claimId)
  if (!claim) return
  claim.removed = true
  claim.save()
}

export function handleClaimUpdated(event: ClaimUpdated): void {
  const network = dataSource.network()
  const claimId = idFromUpdatedEvent(network, event)
  let claim = Claim.load(claimId)
  const data = event.params.claim
  if (!claim) {
    claim = new Claim(claimId)
    claim.claimer = event.params.claimer
    claim.propertyType = data.propertyType
    claim.propoertyId = data.propertyId
    claim.method = data.method
    claim.network = network
  }
  claim.evidence = data.evidence
  claim.removed = false
  claim.save()
}

export function idFromRemovedEvent(
  network: string,
  event: ClaimRemoved,
): string {
  const claimer = event.params.claimer
  const data = event.params.claim
  return [
    claimer.toHexString(),
    data.propertyType,
    data.propertyId,
    data.method,
    network,
  ].join(DELIMITER)
}

export function idFromUpdatedEvent(
  network: string,
  event: ClaimUpdated,
): string {
  return 'test'
}
