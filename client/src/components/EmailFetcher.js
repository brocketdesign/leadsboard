import React, { useState } from 'react';
import axios from 'axios';

const EmailFetcher = () => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/fetch-emails');
      setEmails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setIsLoading(false);
    }
  };
  const initiateOAuthProcess = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/google/url');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error initiating OAuth process:', error);
      // Handle error (show message to the user, etc.)
    }
  };
  return (
    <div className="container mt-5">
      <button className="btn btn-primary" onClick={initiateOAuthProcess}>
        Authenticate with Google
      </button>
      <button
        className="btn btn-success ml-2"
        onClick={fetchEmails}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Fetch Emails'}
      </button>
  
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Reference</th>
            <th>Price</th>
            <th>Link</th>
            <th>Contact Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email, index) => (
            <tr key={index}>
              <td>{email.title}</td>
              <td>{email.reference}</td>
              <td>{email.price}</td>
              <td>
                <a
                  href={email.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-link"
                >
                  View
                </a>
              </td>
              <td>{email.contactName}</td>
              <td>{email.email}</td>
              <td>{email.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};

export default EmailFetcher;
