import nodemailer from "nodemailer";

exports.mailTransport = () => {
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
};

export const welcomeEmailTemplate = (heading:string, message:string) => {
    return `<!DOCTYPE html>
      <link rel="stylesheet" href="style.css" />
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>Onboarding Template</title>
        </head>
        <body>
          <div class="template-container">
            <h1 class="heading">${heading}</h1>
            <div class="email-content">
              <div class="intro-text">
                ${message}
              </div>
              <div></div>
            </div>
          </div>
        </body>
      </html>
      `;
  };

  
export const welcomeEmailTemplateForTeacher = (heading:string, message:string) => {
  return `<!DOCTYPE html>
    <link rel="stylesheet" href="style.css" />
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>${heading}</title>
      </head>
      <body>
        <div class="template-container">
          <h1 class="heading">${heading}</h1>
          <div class="email-content">
            <div class="intro-text">
              ${message}
            </div>
            <div></div>
          </div>
        </div>
      </body>
    </html>
    `;
};

  export const generatePasswordResetTemplate=(url:any)=>{
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    
    <body style="font-family: Arial, sans-serif;">
    
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">
    
            <h2>Password Reset</h2>
    
            <p>Hello,</p>
    
            <p>We received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>
    
            <p>To reset your password, click on the following link:</p>
    
            <p><a href=${url}>Reset Password</a></p>
    
            <p>This link will expire in 24 hours for security reasons.</p>
    
            <p>Thank you,</p>
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>Websystems by Elecdeck(OPC) Pvt. Ltd.</p>
              <p>Lucknow, Uttar Pradesh</p>
              <p>India</p>
            </div>
          </div>
    
    </body>
    
    </html>
    `
  }


  export const changedPasswordEmailTemplate= (heading:string,content:string)=>{
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed</title>
    </head>
    
    <body style="font-family: Arial, sans-serif;">
    
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">
    
            <h2>${heading}</h2>
    
            <p>Hello,</p>
    
            <p>Your password has been changed successfully. If you made this change, you can ignore this email. If you didn't change your password, please contact us immediately.</p>
    
            <p>${content}</p>
    
            <p>Thank you for using our service!</p>
    
            <p>Best regards,<br>WebSystems</p>
    
        </div>
    
    </body>
    
    </html>
    `
  }

  export const generateEmailTemplate = (code:any) => {
    return `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Verification Email</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing websystems. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
          <p style="font-size:0.9em;">Regards,<br />Websystems</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Websystems by Elecdeck(OPC) Pvt. Ltd.</p>
            <p>Lucknow, Uttar Pradesh</p>
            <p>India</p>
          </div>
        </div>
      </div>`;
  };

  export const leaveStatusEmail =(userName: string,leaveDate:any,leaveStatus: string,additionalMessage: string)=>{
    return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Leave Status Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .template-container {
          width: 80%;
          max-width: 600px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .heading {
          color: #4caf50;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .email-content {
          font-size: 16px;
          line-height: 1.6;
        }
        .intro-text {
          margin-bottom: 20px;
        }
        .status-text {
          font-weight: bold;
          color: #ff5722;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="template-container">
        <h1 class="heading">Leave Application Status</h1>
        <div class="email-content">
          <div class="intro-text">
            Dear ${userName},
          </div>
          <div class="intro-text">
            We are writing to inform you about the status of your leave application submitted on ${leaveDate}.
          </div>
          <div class="status-text">
           Your leave is: ${leaveStatus}.
          </div>
          <div class="intro-text">
            ${additionalMessage}
          </div>
        </div>
        <div class="footer">
          If you have any questions or need further assistance, please do not hesitate to contact us.
          <br />
          Best regards,
          <br />
          [Your college]
        </div>
      </div>
    </body>
  </html>
  `;
  }

  export const supportTemplate = (
    complaintNo: string,
    name: string,
    email: string,
    contactNo: any,
    query: string
  ) => {
    return `
      <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Support Ticket - ${complaintNo}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 80%;
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .heading {
        color: #4caf50;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .email-content {
        font-size: 16px;
        line-height: 1.6;
      }
      .info {
        margin-bottom: 10px;
      }
      .info span {
        font-weight: bold;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1 class="heading">Support Ticket ${complaintNo}</h1>
      <div class="email-content">
        <p>Hi there,</p>
        <p>A query has been registered:</p>
        <div class="info">
          <span>Name:</span> ${name}
        </div>
        <div class="info">
          <span>Email:</span> ${email}
        </div>
        <div class="info">
          <span>Contact No:</span> ${contactNo}
        </div>
        <div class="info">
          <span>Query:</span>
          <p>${query}</p>
        </div>
        <p>Query raised by,</p>
        <p>${name}</p>
      </div>
      <div class="footer">
        If you have any questions or need further assistance, please do not hesitate to contact us.
        <br />
        Best regards,
        <br />
        -WebSystems
      </div>
    </div>
  </body>
  </html>`;
  };
  