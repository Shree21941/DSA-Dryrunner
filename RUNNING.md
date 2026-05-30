# 🚀 DSA DryRun - Stack is Running!

## Access Points

### Frontend
```
http://localhost:5173
```
- React app with problem list
- Monaco editor for code input
- Problem detail view with test cases

### Backend API
```
http://localhost:3001
```

#### Available Endpoints:
- `GET /api/problems` - List all 10 seed problems
- `GET /api/problems/:id` - Get specific problem with test cases
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /health` - Server health check
- `GET /db-health` - Database connection check

### Database
```
Host: localhost
Port: 5432
Database: dsadryrun
User: dev
Password: dev
```

### Redis Cache
```
Host: localhost
Port: 6379
```

## Test the API

### Get all problems:
```bash
curl http://localhost:3001/api/problems | jq
```

### Get problem #1 (Two Sum):
```bash
curl http://localhost:3001/api/problems/1 | jq
```

### Register a user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Docker Commands

### View logs:
```bash
sudo docker-compose logs -f server    # Backend logs
sudo docker-compose logs -f client    # Frontend logs
sudo docker-compose logs postgres     # Database logs
```

### Stop stack:
```bash
sudo docker-compose down
```

### Restart stack:
```bash
sudo docker-compose up -d
```

## 📊 Seeded Problems

1. Two Sum (easy)
2. Binary Search (easy)
3. Valid Parentheses (easy)
4. Merge Sorted Arrays (easy)
5. Fibonacci Sequence (easy)
6. BFS - Graph Traversal (medium)
7. DFS - Graph Traversal (medium)
8. Dijkstra Shortest Path (hard)
9. LRU Cache (hard)
10. Climbing Stairs (easy)

Each problem includes:
- Description
- Starter code
- Time complexity
- Space complexity
- Tags (array, hash-table, stack, etc.)
- Multiple test cases

## Next Steps (Week 1 Remaining)
- [ ] Complete auth flow on frontend
- [ ] Implement Monaco editor submission
- [ ] Add execution sandbox (Week 2)
- [ ] Add WebSocket real-time results (Week 2)
