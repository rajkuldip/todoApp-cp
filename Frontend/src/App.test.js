import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

jest.mock('axios');

/*
Note: Here user centric testing approach has been considered over function testing.
*/ 

describe('App component functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const description = "Todo Item 1";

  it('displays todo items', async () => {
    // Mock initial GET request to return a predefined todo item.
    axios.get.mockResolvedValue({ data: [{ id: '1', description, isCompleted: false }] });
  
    // Render the App component.
    render(<App />);
  
    // Wait for the GET request to be called once.
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  
    // Wait for the todo item description to be displayed in the document.
    await waitFor(() => expect(screen.getByText(description)).toBeInTheDocument());
  });
  

  it('adds todo item', async () => {
    // Mock the POST request to return a new todo item
    axios.post.mockResolvedValue({ data: { id: '1', description, isCompleted: false } });
  
    // Render the App component
    render(<App />);
  
    // Find the 'Add Item' button
    const descriptionEl = screen.getByRole('button', { name: /Add Item/i }).tagName;
    console.log(descriptionEl);
  
    // Type the description into the input field
    await userEvent.type(screen.getByLabelText('Description'), description);
  
    // Click the 'Add Item' button
    await userEvent.click(screen.getByRole('button', { name: /Add Item/i }));
  
    // Wait for the POST request to be called
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  
    // Click the 'Refresh' button to fetch the updated list
    await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
  
    // Ensure the new item is displayed in the document
    expect(screen.getByText(description)).toBeInTheDocument();
  });
  

  it('marks item as completed', async () => {
    const description = "Todo Item 1";
  
    // Mock initial GET request
    axios.get.mockResolvedValueOnce({ data: [{ id: '1', description, isCompleted: false }] });
  
    render(<App />);
  
    // Ensure the initial GET request was called and item is displayed
    await waitFor(() => expect(screen.getByText(description)).toBeInTheDocument());
  
    // Mock the PUT request for marking the item as completed
    axios.put.mockResolvedValueOnce({ data: { id: '1', description, isCompleted: true } });
  
    // Click the "Mark as completed" button
    userEvent.click(screen.getByRole('button', { name: 'Mark as completed' }));
  
    // Ensure the PUT request was called
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
  
    // Mock the GET request to return the updated list with the completed item
    axios.get.mockResolvedValueOnce({ data: [{ id: '1', description, isCompleted: true }] });
  
    // Click the "Refresh" button
    userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
  
    // Ensure the completed item is displayed
    await waitFor(() => expect(screen.getByText('Completed')).toBeInTheDocument());
  });
  

  it('displays error message on API error', async () => {
    // Mock the GET request to simulate an API error.
    axios.get.mockRejectedValueOnce(new Error('API error'));
  
    // Render the App component.
    render(<App />);
  
    // Wait for the GET request to be called once.
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  
    // Wait for the error message to be displayed in the document.
    await waitFor(() => expect(screen.getByText('Error fetching items')).toBeInTheDocument());
  });
  
});


it('renders the footer text', () => {
  render(<App />);
  const footerElement = screen.getByText(/clearpoint.digital/i);
  expect(footerElement).toBeInTheDocument();
});
