'use strict';

/**
 * Authorize Access
 * @param {d1.AuthorizeAccess} authorizeAccess
 * @transaction
 */
async function authorizeAccess(tx) {
    // TODO: Check each request to see if it is authorized
    const memberRegistry = await getParticipantRegistry('d1.Member');
    var member = tx.member;
    member.authorizedNumericRequests.concat(member.pendingNumericRequests);
    member.authorizedQualiatativeRequests.concat(member.pendingQualitativeRequests);

    const serviceProviderRegistry = await getParticipantRegistry('d1.ServiceProvider');
    var serviceProvider = tx.serviceProvider;
    serviceProvider.authorizedNumericRequests.concat(member.pendingNumericRequests);
    serviceProvider.authorizedQualitativeRequests.concat(member.pendingQualitativeRequests);
    serviceProviderRegistry.update(serviceProvider);

    member.pendingNumericRequests = [];
    member.pendingQualitativeRequests = [];
    memberRegistry.update(member);

    let event = getFactory().newEvent('d1', 'AuthorizeAccessEvent');
    event.member = tx.member;
    event.serviceProvider = tx.serviceProvider;
    event.numericRequest = tx.numericRequest;
    event.qualitativeRequest = tx.qualitativeRequest;
    event.date = tx.date;
    event.memberSignature = tx.memberSignature;
    emit(event);
}

/**
 * Revoke Access
 * @param {d1.RevokeAccess} revokeAccess
 * @transaction
 */
async function revokeAccess(tx) {
    // TODO: Check each request to see if it is still authorized
    const memberRegistry = await getParticipantRegistry('d1.Member');
    var member = tx.member;
    member.authorizedNumericRequests = [];
    member.authorizedQualiatativeRequests = [];
    memberRegistry.update(member);

    const serviceProviderRegistry = await getParticipantRegistry('d1.ServiceProvider');
    var serviceProvider = tx.serviceProvider;
    serviceProvider.authorizedNumericRequests = [];
    serviceProvider.authorizedQualitativeRequests = [];
    serviceProviderRegistry.update(serviceProvider);

    let event = getFactory().newEvent('d1', 'RevokeAccessEvent');
    event.member = tx.member;
    event.serviceProvider = tx.serviceProvider;
    event.numericRequest = tx.numericRequest;
    event.qualitativeRequest = tx.qualitativeRequest;
    event.date = tx.date;
    emit(event);
}

/**
 * Request Access
 * @param {d1.RequestAccess} requestAccess
 * @transaction
 */
async function requestAccess(tx) {
    const memberRegistry = getParticipantRegistry('d1.Member');
    var member = tx.member;
    if (tx.numericRequest.length > 0) {
        member.pendingNumericRequests.push(tx.numericRequest);
    }
    
    if (tx.qualitativeRequest.length > 0) {
        member.pendingQualitativeRequests.push(tx.qualitativeRequest);
    }

    memberRegistry.update(member);

    let event = getFactory().newEvent('d1', 'RequestAccessEvent');
    event.member = tx.member;
    event.serviceProvider = tx.serviceProvider;
    event.numericRequests = tx.numericRequests;
    event.qualitativeRequests = tx.qualitativeRequests;
    event.date = tx.date;
    event.serviceProviderSignature = tx.serviceProviderSignature;
    emit(event);
}