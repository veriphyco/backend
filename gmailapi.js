// These id's and secrets should come from .env file.
const CLIENT_ID =
  "454789142080-fll2qr9sj77btk32785iumnssbl23hns.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04QRWhdxkGtDlCgYIARAAGAQSNwF-L9IrrnofRE2Of4r6XPe1ieg6hHgCKB5me3EXkNXjVQOd-cUo6Zwl3luK2m6dSlHgFubOv0g";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "solomon@veriphy.co",
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "Veriphy",
      to: "to email address here",
      subject: "Hello from gmail using API",
      text: "Hello from gmail email using API",
      html: "<h1>Hello from gmail email using API</h1>",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

sendMail()
  .then((result) => console.log("Email sent...", result))
  .catch((error) => console.log(error.message));
