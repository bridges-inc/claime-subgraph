import { dataSource } from '@graphprotocol/graph-ts'
import { assert, clearStore, test } from 'matchstick-as/assembly/index'
import { handleClaimUpdated, idFromUpdatedEvent } from '../src/mapping'
import { ClaimEventPayload, newClaimUpdatedEvent } from './utils'

const network = dataSource.network()
const claimerAddress = '0xcdfc500f7f0fce1278aecb0340b523cd55b3ebbb'

function newClaimEventPayload(): ClaimEventPayload {
  return {
    propertyType: 'Twitter',
    propertyId: 'example',
    method: 'Tweet',
    evidence: '1234567890',
  }
}

test('Can generate id from new claim updated events', () => {
  const claim = newClaimEventPayload()
  const updatedEvent = newClaimUpdatedEvent(claimerAddress, claim)
  assert.stringEquals(
    '0xcdfc500f7f0fce1278aecb0340b523cd55b3ebbb|Twitter|example|Tweet|mainnet',
    idFromUpdatedEvent(network, updatedEvent),
  )
})

test('Can generate the same id if claimerAddress, propertyType, propertyId, method and network are the same', () => {
  const claim = newClaimEventPayload()
  const updatedEvent = newClaimUpdatedEvent(claimerAddress, claim)
  const updatedClaim = newClaimEventPayload()
  updatedClaim.evidence = claim.evidence + '2'
  const updatedEvent2 = newClaimUpdatedEvent(claimerAddress, updatedClaim)
  assert.stringEquals(
    idFromUpdatedEvent(network, updatedEvent),
    idFromUpdatedEvent(network, updatedEvent2),
  )
})

test('Can mappings with new claim updated events', () => {
  const claim = newClaimEventPayload()
  const updatedEvent = newClaimUpdatedEvent(claimerAddress, claim)
  handleClaimUpdated(updatedEvent)
  const id = idFromUpdatedEvent(network, updatedEvent)
  assert.fieldEquals('Claim', id, 'propertyType', claim.propertyType)
  assert.fieldEquals('Claim', id, 'propertyId', claim.propertyId)
  assert.fieldEquals('Claim', id, 'method', claim.method)
  assert.fieldEquals('Claim', id, 'evidence', claim.evidence)
  assert.fieldEquals('Claim', id, 'removed', 'false')
  clearStore()
})

test('Can mappings with new claims updated events', () => {
  const claim = newClaimEventPayload()
  const updatedEvent = newClaimUpdatedEvent(claimerAddress, claim)
  handleClaimUpdated(updatedEvent)

  const claim2 = newClaimEventPayload()
  claim2.propertyId = claim.propertyId + '2'
  const updatedEvent2 = newClaimUpdatedEvent(claimerAddress, claim2)
  handleClaimUpdated(updatedEvent2)

  assert.fieldEquals(
    'Claim',
    idFromUpdatedEvent(network, updatedEvent),
    'propertyId',
    claim.propertyId,
  )
  assert.fieldEquals(
    'Claim',
    idFromUpdatedEvent(network, updatedEvent2),
    'propertyId',
    claim2.propertyId,
  )
  clearStore()
})

test('Can mappings with existing claim updated events', () => {
  const claim = newClaimEventPayload()
  const updatedEvent = newClaimUpdatedEvent(claimerAddress, claim)
  handleClaimUpdated(updatedEvent)
  assert.fieldEquals(
    'Claim',
    idFromUpdatedEvent(network, updatedEvent),
    'evidence',
    claim.evidence,
  )
  const updatedClaim = newClaimEventPayload()
  updatedClaim.evidence = '2'
  const updatedEvent2 = newClaimUpdatedEvent(claimerAddress, updatedClaim)
  handleClaimUpdated(updatedEvent2)
  assert.fieldEquals(
    'Claim',
    idFromUpdatedEvent(network, updatedEvent2),
    'evidence',
    updatedClaim.evidence,
  )
  clearStore()
})
