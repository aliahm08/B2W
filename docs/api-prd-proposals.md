# PRD: Proposals API

## Endpoint

`/api/proposals`

## Goal

Maintain a durable, auditable proposal workflow for signing, retrieval, transcripts, and customer delivery.

## Actions

| Action | Result |
| --- | --- |
| `submit` | Validate and store a signed proposal record |
| `document` | Retrieve an authorized transcript or PDF |
| `status` | Return safe status for an authorized proposal |
| `resend` | Internal-only resend of an approved transcript |

## Required behavior

- Preserve immutable signed records and the signed-access-token model.
- Validate signer identity, acceptance, selected option, and signature payload before storage.
- Store delivery attempts and use idempotency so receipts are not duplicated.
- Keep proposal downloads protected by short-lived signed access tokens.
- Route ordinary follow-up messages through `/api/communications`.

## Migration sources

`proposal-signature` becomes `proposals?action=submit`. The existing `proposals` document route becomes an action of this gateway.

## Non-goals

Generic customer intake or client messaging.
