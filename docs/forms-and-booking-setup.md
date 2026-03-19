# Forms and Booking Setup

This site now uses two separate browser-safe conversion flows:

- Public landing pages: a hosted lead form endpoint first, then Calendly as an optional second step after successful submission.
- Client proposal and portal pages: a separate hosted client form endpoint for proposal acceptance, signing acknowledgment, and client communications.

## Required environment variables

Add these in local `.env` files and in Vercel project environment variables:

```bash
VITE_CALENDLY_URL="https://calendly.com/your-team/consultation"
VITE_FORM_ENDPOINT_LEADS="https://formspree.io/f/your-leads-id"
VITE_FORM_ENDPOINT_CLIENT="https://formspree.io/f/your-client-id"
```

## Where each value is used

- `VITE_CALENDLY_URL`
  Used by the Expertise section CTA and by the post-submit "Book a call" CTA after successful public lead submissions.

- `VITE_FORM_ENDPOINT_LEADS`
  Used by the public lead inquiry form on the homepage contact section.

- `VITE_FORM_ENDPOINT_CLIENT`
  Used by client-side proposal acceptance and client communication forms on proposal and portal pages.

## Formspree setup

### 1. Create the public lead endpoint

Create a hosted form such as Formspree for public lead capture.

Recommended fields:

- `name`
- `email`
- `business_name`
- `message`
- `form_type`
- `action_type`
- `source_page`
- `source_path`
- `source_url`
- `submitted_at`
- `site_context`

Configure email notifications to route new submissions to [info@b2w-ai.com](mailto:info@b2w-ai.com).

After a successful public lead submission, the site should reveal a secondary `Book a call` CTA that opens the Calendly URL from `VITE_CALENDLY_URL`.

### 2. Create the client endpoint

Create a second hosted form for client-side actions. Keep this endpoint separate from public leads.

Recommended fields:

- `client_name`
- `email`
- `client_email`
- `authorized_representative`
- `company`
- `message`
- `project_name`
- `proposal_name`
- `selected_option_id`
- `selected_option_title`
- `selected_option_price`
- `form_type`
- `action_type`
- `accepted_terms`
- `signature_name`
- `signature_present`
- `signature_data_url`
- `source_page`
- `source_path`
- `source_url`
- `submitted_at`
- `site_context`

Configure notification emails to route to [info@b2w-ai.com](mailto:info@b2w-ai.com).

Important:

- Use the submitted client email field in the notification template so replies can go directly back to the client.
- If Formspree supports reply-to mapping on your plan, map the reply address to the submitted `email` or `client_email` field.

### 3. Configure client receipts / confirmations

If your hosted form provider supports autoresponders:

- Enable an autoresponse on the client form.
- Set the recipient to the submitted client email field.
- Keep the receipt simple: confirm that B2W received the action and will follow up directly.

You can also enable an autoresponse on the public lead form if desired, but that is optional.

## Site surface mapping

- Calendly:
  Expertise section and the success state after public lead form submission.

- Public hosted lead form:
  Public homepage contact section only.

- Client hosted form flow:
  Borek-G proposal acceptance drawer, Uyghur Eats proposal acceptance modal, and client communication form on the Uyghur Eats portal.

## Manual test checklist

1. Set the three `VITE_*` environment variables locally.
2. Run `npm run dev`.
3. On the homepage, submit the public lead form and confirm Formspree accepts it and routes the notification correctly.
4. After successful public submission, click `Book a call` and confirm it opens the Calendly URL in a new tab.
5. In the Expertise section, click `Book a call` and confirm it opens the Calendly URL in a new tab.
6. Open `/borek-g-operations`, complete the acceptance flow, and confirm the client endpoint receives the payload.
7. Open `/client/uyghur-eats`, submit the acceptance modal, and confirm the client endpoint receives the payload.
8. Submit the client communication form on `/client/uyghur-eats` and confirm the notification includes the client email.
9. If autoresponse is enabled, confirm the submitting email receives a receipt.
