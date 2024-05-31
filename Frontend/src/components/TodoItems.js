import React from 'react';
import { Button, Table } from 'react-bootstrap';


export const TodoItems = ({ items, showCompleted, setShowCompleted, filteredItems, getItems, handleMarkAsComplete }) => {
  return (
    <>
      <h1>
        Showing {filteredItems.length}/{items.length} Item(s)
        <Button variant="primary" className="pull-right" onClick={getItems}>Refresh</Button>
        <Button variant="secondary" className="pull-right mx-2" onClick={() => setShowCompleted(!showCompleted)}>
          {showCompleted ? 'Hide' : 'Show'} Completed Items
        </Button>
      </h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id} className={item.isCompleted ? 'completed' : ''}>
              <td>{item.id}</td>
              <td>{item.description}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleMarkAsComplete(item)}
                  disabled={item.isCompleted}
                >
                  {item.isCompleted ? 'Completed' : 'Mark as completed'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
)}