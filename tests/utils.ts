import { Address, ethereum } from '@graphprotocol/graph-ts'
import { newMockEvent } from 'matchstick-as/assembly/index'
import { ClaimUpdated } from '../generated/Claime/Claime'

export class ClaimEventPayload {
  propertyType: string
  propertyId: string
  method: string
  evidence: string
}

export function newClaimUpdatedEvent(
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
    [],
  )
  setEventParam(updatedEvent, claimerAddress, claim)
  return updatedEvent
}

export function setEventParam(
  event: ethereum.Event,
  claimerAddress: string,
  claim: ClaimEventPayload,
): void {
  event.parameters.push(newClaimerParam(claimerAddress))
  event.parameters.push(newClaimParam(claim))
}

function newClaimerParam(address: string): ethereum.EventParam {
  return new ethereum.EventParam(
    'claimer',
    ethereum.Value.fromAddress(Address.fromString(address)),
  )
}

function newClaimParam(claim: ClaimEventPayload): ethereum.EventParam {
  const claimTuple = new ethereum.Tuple()
  claimTuple.push(ethereum.Value.fromString(claim.propertyType))
  claimTuple.push(ethereum.Value.fromString(claim.propertyId))
  claimTuple.push(ethereum.Value.fromString(claim.method))
  claimTuple.push(ethereum.Value.fromString(claim.evidence))
  const param = new ethereum.EventParam(
    'claim',
    ethereum.Value.fromTuple(claimTuple),
  )
  return param
}
