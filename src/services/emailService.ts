interface ClubApplicationEmailData {
  name: string;
  email: string;
  studentIndexId: string;
  faculty: string;
  year: string;
  interests: string[];
  message?: string;
}

interface SignupApplicationEmailData {
  fullName: string;
  email: string;
  studentIndexId: string;
  phone: string;
  role?: string;
  status?: string;
  lastLogin?: string;
  lastLoginIp?: string;
  isEmailVerified?: boolean;
  profilePicture?: string;
}

// Send club application confirmation email using Netlify function
export const sendClubApplicationEmail = async (data: ClubApplicationEmailData): Promise<boolean> => {
  try {
    // Use Netlify dev URL for local development
    const baseUrl = import.meta.env.DEV ? 'http://localhost:8888' : '';
    const response = await fetch(`${baseUrl}/.netlify/functions/clubApplicationEmail`, {
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
      // console.log('Club application confirmation email sent successfully to:', data.email);
      return true;
    } else {
      // console.error('Failed to send club application email:', result.error);
      return false;
    }
  } catch (error) {
    // console.error('Error sending club application confirmation email:', error);
    return false;
  }
};

// Send signup application email using Netlify function
export const sendSignupApplicationEmail = async (data: SignupApplicationEmailData): Promise<boolean> => {
  try {
    // Use Netlify dev URL for local development
    const baseUrl = import.meta.env.DEV ? 'http://localhost:8888' : '';
    const response = await fetch(`${baseUrl}/.netlify/functions/signupApplicationEmail`, {
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
      // console.log('Signup application email sent successfully to:', data.email);
      return true;
    } else {
      // console.error('Failed to send signup application email:', result.error);
      return false;
    }
  } catch (error) {
    // console.error('Error sending signup application email:', error);
    return false;
  }
};

 