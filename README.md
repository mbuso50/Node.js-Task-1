Shopping List REST API

### Install & Run

```bash
npm install
npm run dev
npm run build
npm start
```

The server starts at **http://localhost:3000**

## API Endpoints

All responses follow this consistent shape:

```json
{ "success": true,  "data": { ... }, "message": "..." }
{ "success": false, "error": "Descriptive message" }
```

---

### `GET /items`

Return all items in the shopping list.

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Milk",
      "quantity": 2,
      "unit": "litres",
      "purchased": false,
      "createdAt": "2025-01-01T08:00:00.000Z",
      "updatedAt": "2025-01-01T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /items`

Add a new item to the list.

**Request Body**

```json
{
  "name": "Bread",
  "quantity": 1,
  "unit": "loaf"
}
```

**Response 201**

```json
{
  "success": true,
  "data": { "id": "...", "name": "Bread", "quantity": 1, "unit": "loaf", "purchased": false, ... },
  "message": "Item created successfully"
}
```

**Response 400** — missing/invalid fields

```json
{
  "success": false,
  "error": "'name' is required and must be a non-empty string"
}
```

---

### `GET /items/:id`

Retrieve a single item by its UUID.

**Response 200**

```json
{ "success": true, "data": { "id": "...", "name": "Eggs", ... } }
```

**Response 404**

```json
{ "success": false, "error": "Item with id '...' not found" }
```

---

### `PUT /items/:id`

Update one or more fields of an existing item.

**Request Body** (at least one field required)

````json
{
  "quantity": 2,
  "purchased": true
}


**Response 200**
```json
{
  "success": true,
  "data": { "id": "...", "name": "Milk", "quantity": 2, "purchased": true, ... },
  "message": "Item updated successfully"
}
````

**Response 400**

```json
{ "success": false, "error": "'quantity' must be a positive number" }
```

**Response 404**

```json
{ "success": false, "error": "Item with id '...' not found" }
```

---

`DELETE /items/:id`
Remove an item from the list.

**Response 204** — No Content (empty body on success)

**Response 404**

{ "success": false, "error": "Item with id '...' not found" }

Testing with Postman

1. Get all items

GET http://localhost:3000/items

2.  Add an item

POST http://localhost:3000/items
{ "name": "Cheese", "quantity": 200, "unit": "grams" }

3. Get one item (copy an id from step 1)

GET http://localhost:3000/items/<id>

4. Update — mark as purchased & change quantity

PUT http://localhost:3000/items/<id>

5. Delete an item

DELETE http://localhost:3000/items/<id>

Error Reference
200 = OK  
201 = Created  
204 = No Content (DELETE)  
400 = Bad Request / Validation
404 = Not Found  
405 =Method Not Allowed  
500 = Internal Server Error
