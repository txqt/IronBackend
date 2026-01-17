# Design Rules

IronBackend enforces strict design rules to prevent technical debt.

## Rule 1: No Direct Database Access in Controllers
Controllers should only handle HTTP concerns (request parsing, response formatting). All business logic and data access must go through Services or Use Cases.

**❌ Bad:**
```typescript
// UserController.ts
app.post('/users', async (req, res) => {
  const user = await db.users.create(req.body); // Direct DB access
  res.send(user);
});
```

**✅ Good:**
```typescript
// UserController.ts
app.post('/users', async (req, res) => {
  const user = await userService.createUser(req.body);
  res.send(user);
});
```

## Rule 2: Explicit Dependency Injection
Avoid importing singletons directly. Pass dependencies via constructor or factory.

## Rule 3: Zod Validation Everywhere
Never trust user input. All DTOs must have a corresponding Zod schema.
