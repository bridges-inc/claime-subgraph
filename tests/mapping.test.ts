import { ethereum } from '@graphprotocol/graph-ts'
import { log, newMockEvent, test } from 'matchstick-as/assembly/index'
import { ClaimUpdated } from '../generated/Claime/Claime'
import { handleClaimUpdated } from '../src/mapping'
class ClaimEventPayload {
  propertyType: string
  propertyId: string
  method: string
  evidence: string
}
const network = 'test' //dataSource.network()
const claimerAddress = '0x1'

test('Can mappings with new claim updated events', () => {
  const claim: ClaimEventPayload = {
    propertyType: 'Domain',
    propertyId: 'example.com',
    method: 'TXT',
    evidence: '',
  }
  const event = newClaimUpdatedEvent(claimerAddress, claim)
  handleClaimUpdated(event)
  log.info('claim', [''])

  // assert.fieldEquals(
  //   'Claim',
  //   idFromUpdatedEvent(network, event),
  //   'propetyType',
  //   claim.propertyType,
  // )
  // clearStore()
})

function newClaimUpdatedEvent(
  claimerAddress: string,
  claim: ClaimEventPayload,
): ClaimUpdated {
  const event = newMockEvent()
  const updatedEvent = new ClaimUpdated(
    event.address,
    event.logIndex,
    event.transactionLogIndex,
    event.logType,
    event.block,
    event.transaction,
    event.parameters,
  )
  setEventParam(updatedEvent, claimerAddress, claim)
  return updatedEvent
}

function setEventParam(
  event: ethereum.Event,
  claimerAddress: string,
  claim: ClaimEventPayload,
): void {
  const addressParam = new ethereum.EventParam(
    'claimer',
    ethereum.Value.fromString(claimerAddress),
  )
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam(
      'claimer',
      ethereum.Value.fromString(claimerAddress),
    ),
  )
  const tp = new ethereum.Tuple(4)
  tp.push(ethereum.Value.fromString(claim.propertyType))
  tp.push(ethereum.Value.fromString(claim.propertyId))
  tp.push(ethereum.Value.fromString(claim.method))
  tp.push(ethereum.Value.fromString(claim.evidence))
  const tuple = ethereum.Value.fromTuple(tp)
  event.parameters.push(new ethereum.EventParam('claim', tuple))
}
