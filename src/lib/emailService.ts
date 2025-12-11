// Email service for sending employee credentials
// This uses a simple fetch to a backend endpoint

interface SendEmailParams {
  to: string;
  employeeName: string;
  email: string;
  password: string;
  loginUrl: string;
}

export const sendWelcomeEmail = async (params: SendEmailParams): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: params.to,
        subject: 'Welcome to MedSpa Opus - Your Login Credentials',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MedSpa Opus!</h1>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #374151;">Hello <strong>${params.employeeName}</strong>,</p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                Your employee account has been successfully created! You can now access the MedSpa Opus employee portal.
              </p>
              
              <div style="background-color: #f3f4f6; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea;">Your Login Credentials</h3>
                <p style="margin: 10px 0;"><strong>Email:</strong> <code style="background-color: #e5e7eb; padding: 3px 8px; border-radius: 4px; font-size: 14px;">${params.email}</code></p>
                <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background-color: #e5e7eb; padding: 3px 8px; border-radius: 4px; font-size: 14px;">${params.password}</code></p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${params.loginUrl}" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Login to Your Account
                </a>
              </div>
              
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong> Please change your password after your first login for security purposes.
                </p>
              </div>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                If you have any questions or need assistance, please contact your administrator.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #6b7280; font-size: 12px; text-align: center;">
                This is an automated message from MedSpa Opus. Please do not reply to this email.
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Email sending failed');
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
