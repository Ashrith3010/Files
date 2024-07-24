// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // State for new transaction input
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from localStorage
        if (!token) {
          setError('No token found. Please log in.');
          navigate('/login', { replace: true });
          return;
        }
        const response = await axios.get('http://localhost:5001/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data);
      } catch (err) {
        setError('Failed to fetch transactions.');
      }
    };

    fetchTransactions();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Remove token from localStorage
    navigate('/login', { replace: true }); // Redirect to login page and replace the history stack
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from localStorage
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login', { replace: true });
        return;
      }
      const response = await axios.post('http://localhost:5001/api/transactions', {
        description,
        category,
        amount,
        date
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions([...transactions, response.data.transaction]); // Update the transactions state
      setDescription('');
      setCategory('Income');
      setAmount('');
      setDate('');
    } catch (err) {
      setError('Failed to add transaction.');
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from localStorage
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login', { replace: true });
        return;
      }
      await axios.delete(`http://localhost:5001/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transactions.filter(transaction => transaction.id !== id)); // Update the transactions state
    } catch (err) {
      setError('Failed to delete transaction.');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      {error && <p>{error}</p>}
      
      <h3>Add Transaction</h3>
      <form onSubmit={handleAddTransaction}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Transaction</button>
      </form>

      <h3>Income</h3>
      <ul>
        {transactions.filter(transaction => transaction.category === 'Income').map(transaction => (
          <li key={transaction.id}>
            {transaction.description}: ${transaction.amount} on {transaction.date}
            <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Expenses</h3>
      <ul>
        {transactions.filter(transaction => transaction.category === 'Expense').map(transaction => (
          <li key={transaction.id}>
            {transaction.description}: ${transaction.amount} on {transaction.date}
            <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
