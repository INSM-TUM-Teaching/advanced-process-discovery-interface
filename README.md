# 🧠 Advanced Process Discovery tool

---

## 🗂 Project Structure

```
project-root/
├── activity-relationship-matrix-discovery/     # Rust API (port 8081)
├── automated-process-classification/           # Rust API (port 8082)
├── event-log-to-declare-json/                  # Rust API (port 8083)
├── apd-integration/
│   └── apps/
│       └── apd-ui/                             # React frontend app
```

---

## 🚀 Requirements

- **Rust:** `cargo 1.86.0`
- **Node.js/NPM:** `npm 10.8.2` (Node.js v20+ recommended)
- **OS:** Linux, macOS, or Windows
- **Terminal:** Bash (for Linux/macOS) or PowerShell/Batch (for Windows)

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tiagogs04/apd-interface.git
cd apd-interface
```

---

### 2. Start Backend Services (Rust APIs)

Each Rust service exposes a dedicated API:

| Service                            | Port |
|------------------------------------|------|
| Activity Relationship Matrix       | 8081 |
| Automated Process Classification   | 8082 |
| Event Log to Declare JSON          | 8083 |

#### 💻 Linux/macOS

Run the services in background:

```bash
(cd activity-relationship-matrix-discovery && cargo run -p api-server) &
(cd automated-process-classification && cargo run -p api-server) &
(cd event-log-to-declare-json && cargo run -p api-server) &
```

Or use `start.sh` (see below).

#### 🪟 Windows

Use the batch script:

```bat
start.bat
```

---

### 3. Start Frontend App (React)

Navigate to the UI directory and run:

```bash
cd apd-integration/apps/apd-ui
npm install
npm run dev
```

Then open your browser to:  
📍 `http://localhost:5173`

---

## 🔁 Scripts

| Script             | Platform         | Description                           |
|--------------------|------------------|---------------------------------------|
| `start.sh` | Linux/macOS      | Starts all Rust services and React app in background |
| `start.bat`| Windows (.bat)   | Same but for windows |

> All scripts are located at the project root.

---

## 📌 Custom API Endpoints

Each service runs independently on its port and route:

- **Matrix Discovery API**: `http://localhost:8081/algo`
- **Classification API**: `http://localhost:8082/algo`

You can also use custom algorithms by hosting your own endpoints and using them in the UI

---

## 🛠 Troubleshooting

- Make sure ports 8081–8083 are free.
- Run `cargo check` inside each Rust project to verify builds.
- Delete `node_modules` and reinstall if frontend throws module errors:
  ```bash
  rm -rf node_modules && npm install
  ```

