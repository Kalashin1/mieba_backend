/* eslint-disable prettier/prettier */
export function generateVerifyEmailTemplate({ name, url }) {
  return `
    <div>
      <h3>Hello ${name}</h3>
      <p>Please click the <a href="${url}">here</a> to verify your email.</p>

      <p>You can also use this link to verify your email.</p>
      ${url}
    </div>
  `;
}

export function generateQRCodeTemplate({ name, src }) {
  return `
    <div>
      <h3>Hello ${name}</h3>
      <p>Use the QRCode provided to verify the authencity of your document</p>
      <a href="${src}">Click to view your code.</a>
    </div>
  `;
}

export function generateDownloadLinkTemplate({ url, name }) {
  return `
    <div>
      <h3>Hello ${name}</h3>
      <p>Use the QRCode provided to verify the authencity of your document</p>
      <a href="${url}">Click to download your document.</a>

      <h5>Alternatively, you copy and paste the link to download</h5>
      <p>${url}</p>
    </div>
  `
}