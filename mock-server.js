const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Mock Data
const MOCK_USER = {
  id: 1,
  fullName: "Admin User",
  username: "admin",
  roleId: 1,
  role: { name: "Admin" }
};

const MOCK_EMPLOYEES = Array.from({ length: 50 }, (_, i) => ({
  id: `EMP-${i + 1}`,
  firstName: ["John", "Jane", "Alice", "Bob", "Charlie"][i % 5],
  lastName: ["Doe", "Smith", "Johnson", "Brown", "Williams"][i % 5],
  email: `employee${i + 1}@example.com`,
  position: ["Developer", "Designer", "Manager", "HR", "Sales"][i % 5],
  department: ["Engineering", "Design", "Management", "Human Resources", "Sales"][i % 5],
  status: ["Active", "Inactive", "On Leave"][i % 3],
  dateOfJoining: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  image: `https://i.pravatar.cc/150?u=${i + 1}`,
  team: ["Alpha", "Beta", "Gamma"][i % 3],
  role: ["Admin", "User", "Manager"][i % 3]
}));

// Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple mock authentication
  if (username === 'admin' && password === 'password') {
    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user: MOCK_USER,
        accessToken: "mock-access-token-" + Date.now(),
        refreshToken: "mock-refresh-token-" + Date.now()
      }
    });
  }
  
  return res.status(401).json({
    success: false,
    message: "Invalid credentials. Try admin/password"
  });
});

app.get('/api/employees', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedEmployees = MOCK_EMPLOYEES.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      data: paginatedEmployees,
      total: MOCK_EMPLOYEES.length,
      page,
      limit
    }
  });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
