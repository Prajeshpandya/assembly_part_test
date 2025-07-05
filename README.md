# 🧩 NestJS Inventory Assembly API

This is a simple NestJS-based backend API for managing an inventory of parts, including both **RAW** materials and **ASSEMBLED** products (which are composed of other parts).

---

## 🚀 Features

- Add RAW and ASSEMBLED parts
- Maintain part inventory with quantity tracking
- Prevent circular dependencies between parts
- Automatically deduct required quantities from sub-parts when assembling
- Custom `id` field for readable references like `bolt-1`, `gearbox-1`

---

## 🔧 Installation & Running

### 1. Clone the repository

```bash
git clone https://github.com/Prajeshpandya/NestJs_test_assembly_part.git
cd NestJs_test_assembly_part
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file and include your MongoDB connection:

```env
MONGO_URI=mongodb://localhost:27017/inventory
PORT=3000
```

> Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Run the app

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## 📮 API Usage

### 🔹 Create a RAW Part

**POST** `http://localhost:3000/api/v1/part`

**Request Body:**

```json
{
  "name": "Bolt",
  "type": "RAW"
}
```

---

### 🔹 Create an ASSEMBLED Part

**POST** `http://localhost:3000/api/v1/part`

**Request Body:**

```json
{
  "name": "Gearbox",
  "type": "ASSEMBLED",
  "parts": [
    {
      "id": "bolt-1",
      "quantity": 4
    }
  ]
}
```

> ✅ Make sure `bolt-1` (RAW part) already exists and has enough quantity.

---

### 🔹 Add Inventory to a Part

**POST** `http://localhost:3000/api/v1/part/:id`

**Example:**

```http
POST http://localhost:3000/api/v1/part/gearbox-1
```

**Request Body:**

```json
{
  "quantity": 2
}
```

* For RAW parts: increases quantity directly
* For ASSEMBLED parts: checks if enough raw parts exist, deducts them, and increases assembled part quantity

---

## 🛠 Special Notes

### ✅ Custom `id` Field

* This project adds a custom `id` field (e.g., `bolt-1`, `gearbox-1`) to each part.
* Used instead of the default `_id` field in MongoDB
* Helpful for clean references in nested assemblies

### 🔁 Circular Dependency Prevention

* Automatically checks for cycles before creating an ASSEMBLED part
* Prevents structures like:

```
Gearbox -> Motor -> Gearbox ❌
```

---

## 📦 Tech Stack

* **Framework:** NestJS
* **Database:** MongoDB (via Mongoose)
* **Language:** TypeScript

---

## 🧑‍💻 Author

**Prajesh Pandya**

* GitHub: [@Prajeshpandya](https://github.com/Prajeshpandya)
* Repo: [NestJs\_test\_assembly\_part](https://github.com/Prajeshpandya/NestJs_test_assembly_part)

---

