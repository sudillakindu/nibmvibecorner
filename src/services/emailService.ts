interface EmailData {
  name: string;
  email: string;
  faculty: string;
  year: string;
  interests: string[];
  message?: string;
}

// Send confirmation email using Netlify function
export const sendConfirmationEmail = async (data: EmailData): Promise<boolean> => {
  try {
    // Use Netlify dev URL for local development
    const baseUrl = import.meta.env.DEV ? 'http://localhost:8888' : '';
    const response = await fetch(`${baseUrl}/.netlify/functions/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('Confirmation email sent successfully to:', data.email);
      return true;
    } else {
      console.error('Failed to send email:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

 