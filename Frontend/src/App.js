import './App.css';
import { Image, Alert, Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AddTodoItem } from './components/AddTodoItem';
import { TodoItems } from './components/TodoItems';

import axios from 'axios';

const baseURL = 'http://localhost:7000/api/todoItems';

const App = () => {
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [error, setError] = useState('');

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const getItems = useCallback(async () => {
    try {
      const response = await axios.get(baseURL);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Error fetching items');
    }
  }, []);

  useEffect(() => {
    getItems();
  }, [getItems]);


  const handleAdd = useCallback(async () => {
    try {
      if (description.trim().length) {
        console.log('Description:', description); // Debugging log
        const newItem = {
          description,
          isCompleted: false,
        };
        const response = await axios.post(baseURL, newItem);
        console.log('Response:', response); // Debugging log
        setItems((prevItems) => [...prevItems, response.data]);
        setDescription('');
        setError(null);
      }
    } catch (error) {
      setError('Error adding item');
    }
  }, [description]);
  

  const handleClear = () => {
    setDescription('');
  };

  const handleMarkAsComplete = useCallback(async (item) => {
    try {
      const updatedItem = { ...item, isCompleted: true };
      const response = await axios.put(`${baseURL}/${item.id}`, updatedItem);
      setItems(items.map(todo => todo.id === item.id ? response.data : todo));
    } catch (error) {
      console.error('Error marking item as complete:', error);
      setError(error.message);
    }
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => showCompleted || !item.isCompleted);
  }, [items, showCompleted]);

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <Image src="clearPointLogo.png" fluid rounded />
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="success">
              <Alert.Heading>Todo List App</Alert.Heading>
              Welcome to the ClearPoint frontend technical test. We like to keep things simple, yet clean so your
              task(s) are as follows:
              <br /><br />
              <ol className="list-left">
                <li>Add the ability to add (POST) a Todo Item by calling the backend API</li>
                <li>
                  Display (GET) all the current Todo Items in the below grid and display them in any order you wish
                </li>
                <li>
                  Bonus points for completing the 'Mark as completed' button code for allowing users to update and mark
                  a specific Todo Item as completed and for displaying any relevant validation errors/messages from the
                  API in the UI
                </li>
                <li>Feel free to add unit tests and refactor the component(s) as best you see fit</li>
              </ol>
            </Alert>
          </Col>
        </Row>
        {error && (
          <Row>
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}
        <Row>
          <Col><AddTodoItem description={description} handleAdd={handleAdd} handleClear={handleClear} handleDescriptionChange={handleDescriptionChange}/></Col>
        </Row>
        <br />
        <Row>
          <Col><TodoItems items={items} showCompleted={showCompleted} setShowCompleted={setShowCompleted} filteredItems={filteredItems} getItems={getItems} handleMarkAsComplete={handleMarkAsComplete}/></Col>
        </Row>
      </Container>
      <footer className="page-footer font-small teal pt-4">
        <div className="footer-copyright text-center py-3">
          © 2021 Copyright:
          <a href="https://clearpoint.digital" target="_blank" rel="noreferrer">
            clearpoint.digital
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
