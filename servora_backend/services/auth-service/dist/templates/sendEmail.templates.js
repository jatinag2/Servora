"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailUpdatePasswordTemplate = exports.sendEmailTemplate = void 0;
const sendEmailTemplate = (otp) => {
    return (`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OTP Verification</title>

  <style>
    body{
      margin:0;
      padding:0;
      background:#f3f4f6;
      font-family:Arial, sans-serif;
    }

    .container{
      max-width:500px;
      margin:40px auto;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 4px 10px rgba(0,0,0,0.1);
    }

    .header{
      background:#4f46e5;
      color:white;
      text-align:center;
      padding:25px;
    }

    .header h1{
      margin:0;
      font-size:28px;
    }

    .content{
      padding:40px 30px;
      text-align:center;
    }

    .content p{
      color:#4b5563;
      font-size:16px;
      line-height:1.6;
      margin:12px 0;
    }

    .otp-box{
      margin:30px 0;
      padding:20px;
      background:#f9fafb;
      border:2px dashed #6366f1;
      border-radius:12px;
    }

    .otp{
      font-size:38px;
      font-weight:bold;
      letter-spacing:10px;
      color:#4f46e5;
    }

    .expire{
      color:#dc2626;
      font-size:14px;
      font-weight:bold;
      margin-top:10px;
    }

    .footer{
      background:#f9fafb;
      text-align:center;
      padding:18px;
      border-top:1px solid #e5e7eb;
      font-size:12px;
      color:#6b7280;
    }

  </style>
</head>

<body>

  <div class="container">

    <div class="header">
      <h1>Verify Your Email</h1>
    </div>

    <div class="content">

      <p>Thank you for signing up.</p>

      <p>
        Use the OTP below to verify your account.
      </p>

      <div class="otp-box">
        <div class="otp">${otp}</div>
      </div>

      <div class="expire">
        OTP expires in 5 minutes
      </div>

      <p>
        If you did not create this account, you can safely ignore this email.
      </p>

    </div>

    <div class="footer">
      © 2026 Your Company. All rights reserved.
    </div>

  </div>

</body>
</html>`);
};
exports.sendEmailTemplate = sendEmailTemplate;
const sendEmailUpdatePasswordTemplate = () => {
    return (`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Updated</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="background:#ffffff; border-radius:10px; padding:40px;">

          <tr>
            <td align="center">
              <h1 style="color:#22c55e; margin-bottom:10px;">
                Password Updated Successfully
              </h1>
            </td>
          </tr>

          <tr>
            <td>
              <p style="font-size:16px; color:#333333; line-height:1.6;">
                Hello,
              </p>

              <p style="font-size:16px; color:#333333; line-height:1.6;">
                Your account password has been changed successfully.
              </p>

              <p style="font-size:16px; color:#333333; line-height:1.6;">
                If you made this change, no further action is required.
              </p>

              <p style="font-size:16px; color:#d32f2f; line-height:1.6; font-weight:bold;">
                If you did NOT change your password, please secure your account immediately.
              </p>

              <p style="font-size:16px; color:#333333; line-height:1.6;">
                Thank you,<br/>
                Servora Team
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`);
};
exports.sendEmailUpdatePasswordTemplate = sendEmailUpdatePasswordTemplate;
