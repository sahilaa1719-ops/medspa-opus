// License Expiry Reminder Service
import { supabase } from './supabase';

interface LicenseWithEmployee {
  id: string;
  license_type: string;
  license_number: string;
  expiry_date: string;
  employee_id: string;
  employees: {
    full_name: string;
    email: string;
  };
}

// Calculate days until expiry
const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if reminder was already sent
const wasReminderSent = (licenseId: string, reminderType: '30day' | '7day' | 'expired'): boolean => {
  const key = `reminder_${licenseId}_${reminderType}`;
  return localStorage.getItem(key) === 'sent';
};

// Mark reminder as sent
const markReminderSent = (licenseId: string, reminderType: '30day' | '7day' | 'expired'): void => {
  const key = `reminder_${licenseId}_${reminderType}`;
  localStorage.setItem(key, 'sent');
};

// Send email reminder using Supabase
const sendReminderEmail = async (
  employeeName: string,
  employeeEmail: string,
  licenseType: string,
  licenseNumber: string,
  expiryDate: string,
  daysUntil: number
): Promise<boolean> => {
  try {
    let subject = '';
    let message = '';

    if (daysUntil <= 0) {
      subject = '🚨 URGENT: Your License Has Expired';
      message = `
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #991b1b; margin: 0 0 10px 0;">⚠️ License Expired</h3>
          <p style="color: #991b1b; margin: 0;">
            Your license has expired and requires immediate renewal. Please contact your administrator or renew your license as soon as possible.
          </p>
        </div>
      `;
    } else if (daysUntil <= 7) {
      subject = '⚠️ URGENT: Your License Expires in ' + daysUntil + ' Days';
      message = `
        <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #9a3412; margin: 0 0 10px 0;">⚠️ Final Reminder</h3>
          <p style="color: #9a3412; margin: 0;">
            Your license will expire in <strong>${daysUntil} days</strong>. Please renew it immediately to avoid any work interruptions.
          </p>
        </div>
      `;
    } else {
      subject = '📋 Reminder: Your License Expires in ' + daysUntil + ' Days';
      message = `
        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0;">📋 Upcoming Expiration</h3>
          <p style="color: #1e40af; margin: 0;">
            Your license will expire in <strong>${daysUntil} days</strong>. Please begin the renewal process to ensure continuity.
          </p>
        </div>
      `;
    }

    const emailHTML = generateEmailHTML(employeeName, licenseType, licenseNumber, expiryDate, message);

    // Use Supabase Edge Function to send email
    const { data, error } = await supabase.functions.invoke('send-license-reminder', {
      body: {
        to: employeeEmail,
        subject: subject,
        html: emailHTML,
        employeeName: employeeName,
        licenseType: licenseType,
        licenseNumber: licenseNumber,
        expiryDate: expiryDate,
        daysUntil: daysUntil
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      // Log details for manual follow-up
      console.log('=== LICENSE EXPIRY REMINDER (FAILED TO SEND) ===');
      console.log('To:', employeeEmail);
      console.log('Subject:', subject);
      console.log('Employee:', employeeName);
      console.log('License:', licenseType, licenseNumber);
      console.log('Expires:', expiryDate);
      console.log('Days Until Expiry:', daysUntil);
      console.log('===============================================');
      return false;
    }

    console.log('✅ Email sent successfully to:', employeeEmail);
    return true;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
};

// Generate email HTML template
const generateEmailHTML = (
  employeeName: string,
  licenseType: string,
  licenseNumber: string,
  expiryDate: string,
  messageBlock: string
): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">License Expiry Reminder</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #374151;">Hello <strong>${employeeName}</strong>,</p>
        
        ${messageBlock}
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">License Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">License Type:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${licenseType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">License Number:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${licenseNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Expiry Date:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${new Date(expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          To renew your license, please contact your administrator or visit your licensing authority's website.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          This is an automated reminder from MedSpa Opus. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
};

// Main function to check and send reminders
export const checkAndSendLicenseReminders = async (): Promise<{
  checked: number;
  sent: number;
  errors: number;
}> => {
  try {
    // Fetch all licenses with employee info
    const { data: licenses, error } = await supabase
      .from('licenses')
      .select(`
        id,
        license_type,
        license_number,
        expiry_date,
        employee_id,
        employees:employee_id (
          full_name,
          email
        )
      `)
      .not('expiry_date', 'is', null);

    if (error) throw error;

    let checked = 0;
    let sent = 0;
    let errors = 0;

    for (const license of (licenses as LicenseWithEmployee[])) {
      checked++;
      const daysUntil = getDaysUntilExpiry(license.expiry_date);

      // Check if we need to send a reminder
      let shouldSend = false;
      let reminderType: '30day' | '7day' | 'expired' | null = null;

      if (daysUntil <= 0 && !wasReminderSent(license.id, 'expired')) {
        shouldSend = true;
        reminderType = 'expired';
      } else if (daysUntil > 0 && daysUntil <= 7 && !wasReminderSent(license.id, '7day')) {
        shouldSend = true;
        reminderType = '7day';
      } else if (daysUntil > 7 && daysUntil <= 30 && !wasReminderSent(license.id, '30day')) {
        shouldSend = true;
        reminderType = '30day';
      }

      if (shouldSend && reminderType) {
        const success = await sendReminderEmail(
          license.employees.full_name,
          license.employees.email,
          license.license_type,
          license.license_number,
          license.expiry_date,
          daysUntil
        );

        if (success) {
          markReminderSent(license.id, reminderType);
          sent++;
        } else {
          errors++;
        }
      }
    }

    return { checked, sent, errors };
  } catch (error) {
    console.error('Error checking license reminders:', error);
    return { checked: 0, sent: 0, errors: 1 };
  }
};
