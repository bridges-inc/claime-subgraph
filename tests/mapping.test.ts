import { Address, ethereum } from '@graphprotocol/graph-ts'
import { assert, newMockEvent, test } from 'matchstick-as/assembly/index'
import { ClaimUpdated } from '../generated/Claime/Claime'
import { idFromUpdatedEvent } from '../src/mapping'

class ClaimEventPayload {
  propertyType: string
  propertyId: string
  method: string
  evidence: string
}
export function runTests(): void {
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
    // handleClaimUpdated(event)
    assert.stringEquals(
      '0x1|Domain|example.com|TXT',
      idFromUpdatedEvent(network, event),
    )

    // assert.fieldEquals(
    //   'Claim',
    //   idFromUpdatedEvent(network, event),
    //   'propetyType',
    //   claim.propertyType,
    // )
    // clearStore()
  })
}
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
    ethereum.Value.fromAddress(Address.fromString(claimerAddress)),
  )

  const tp = new ethereum.Tuple(4)
  tp.push(ethereum.Value.fromString(claim.propertyType))
  tp.push(ethereum.Value.fromString(claim.propertyId))
  tp.push(ethereum.Value.fromString(claim.method))
  tp.push(ethereum.Value.fromString(claim.evidence))
  const tuple = ethereum.Value.fromTuple(tp)
  const claimParam = new ethereum.EventParam('claim', tuple)
  event.parameters.concat([addressParam, claimParam])
}
