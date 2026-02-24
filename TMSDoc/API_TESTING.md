# API Testing (TicketMS)

Base URL: `http://localhost:3000`

## Default test users (as used by the seeded test)

- MANAGER: **Vraj** — `vraj.patel@ticketms.com` / `Vraj@123`
- SUPPORT: **Tirth** — `tirth.shah@ticketms.com` / `Tirth@123`
- USER: **Lion** — `lion.mehta@ticketms.com` / `Lion@123`

Note: these accounts can be overridden by env vars in the Python test (`MANAGER_EMAIL`, `MANAGER_PASSWORD`, etc.).

## Option A (recommended): Run the full seeded E2E test

This will:
1) Ensure the 3 users exist in MongoDB (and hash their passwords)
2) Login as all roles
3) Create ticket → list tickets → assign → status flow → comments CRUD → cleanup

Prereqs:

- Server running (`node server.js` in `ticket-helpdesk-api/`)
- `MONGO_URI` present in `ticket-helpdesk-api/.env` (or as an environment variable)
- Python packages: `pymongo[srv]` and `bcrypt`

```powershell
cd d:\project\TicketMS\ticket-helpdesk-api
python -m pip install "pymongo[srv]" bcrypt
python .\check_all_apis_seeded.py
```

## Option B: Manual API testing (PowerShell copy/paste)

Set base URL:

```powershell
$BASE_URL = "http://localhost:3000"
```

### 1) Login (get tokens)

```powershell
$MANAGER_TOKEN = (Invoke-RestMethod -Method Post -Uri "$BASE_URL/auth/login" -ContentType "application/json" -Body (@{ email = "vraj.patel@ticketms.com"; password = "Vraj@123" } | ConvertTo-Json)).token
$SUPPORT_TOKEN = (Invoke-RestMethod -Method Post -Uri "$BASE_URL/auth/login" -ContentType "application/json" -Body (@{ email = "tirth.shah@ticketms.com"; password = "Tirth@123" } | ConvertTo-Json)).token
$USER_TOKEN    = (Invoke-RestMethod -Method Post -Uri "$BASE_URL/auth/login" -ContentType "application/json" -Body (@{ email = "lion.mehta@ticketms.com"; password = "Lion@123" } | ConvertTo-Json)).token
```

### 2) List users (MANAGER)

```powershell
Invoke-RestMethod -Method Get -Uri "$BASE_URL/users" -Headers @{ Authorization = "Bearer $MANAGER_TOKEN" }
```

### 3) Create ticket (USER)

```powershell
$ticket = Invoke-RestMethod -Method Post -Uri "$BASE_URL/tickets" -ContentType "application/json" -Headers @{ Authorization = "Bearer $USER_TOKEN" } -Body (@{
  title = "Laptop issue"
  description = "My laptop is not starting"
  priority = "LOW"
} | ConvertTo-Json)

$TICKET_ID = $ticket._id
$TICKET_ID
```

### 4) Get tickets (role behavior)

```powershell
Invoke-RestMethod -Method Get -Uri "$BASE_URL/tickets" -Headers @{ Authorization = "Bearer $MANAGER_TOKEN" } # all
Invoke-RestMethod -Method Get -Uri "$BASE_URL/tickets" -Headers @{ Authorization = "Bearer $SUPPORT_TOKEN" }  # assigned to support
Invoke-RestMethod -Method Get -Uri "$BASE_URL/tickets" -Headers @{ Authorization = "Bearer $USER_TOKEN" }     # created by user
```

### 5) Assign ticket (MANAGER or SUPPORT)

Get support user `_id` from `/users` response. Then:

```powershell
$SUPPORT_USER_ID = "PASTE_SUPPORT_USER__ID_HERE"
Invoke-RestMethod -Method Patch -Uri "$BASE_URL/tickets/$TICKET_ID/assign" -ContentType "application/json" -Headers @{ Authorization = "Bearer $MANAGER_TOKEN" } -Body (@{ userId = $SUPPORT_USER_ID } | ConvertTo-Json)
```

### 6) Update status (MANAGER or assigned SUPPORT)

Valid transitions only: `OPEN → IN_PROGRESS → RESOLVED → CLOSED`

```powershell
Invoke-RestMethod -Method Patch -Uri "$BASE_URL/tickets/$TICKET_ID/status" -ContentType "application/json" -Headers @{ Authorization = "Bearer $MANAGER_TOKEN" } -Body (@{ status = "IN_PROGRESS" } | ConvertTo-Json)
Invoke-RestMethod -Method Patch -Uri "$BASE_URL/tickets/$TICKET_ID/status" -ContentType "application/json" -Headers @{ Authorization = "Bearer $MANAGER_TOKEN" } -Body (@{ status = "RESOLVED" } | ConvertTo-Json)
Invoke-RestMethod -Method Patch -Uri "$BASE_URL/tickets/$TICKET_ID/status" -ContentType "application/json" -Headers @{ Authorization = "Bearer $MANAGER_TOKEN" } -Body (@{ status = "CLOSED" } | ConvertTo-Json)
```

Invalid transition test (should be HTTP 400):

```powershell
Invoke-RestMethod -Method Patch -Uri "$BASE_URL/tickets/$TICKET_ID/status" -ContentType "application/json" -Headers @{ Authorization = "Bearer $MANAGER_TOKEN" } -Body (@{ status = "OPEN" } | ConvertTo-Json)
```

### 7) Comments

Add comment:

```powershell
$comment = Invoke-RestMethod -Method Post -Uri "$BASE_URL/tickets/$TICKET_ID/comments" -ContentType "application/json" -Headers @{ Authorization = "Bearer $USER_TOKEN" } -Body (@{ comment = "Please help ASAP" } | ConvertTo-Json)
$COMMENT_ID = $comment._id
$COMMENT_ID
```

List comments:

```powershell
Invoke-RestMethod -Method Get -Uri "$BASE_URL/tickets/$TICKET_ID/comments" -Headers @{ Authorization = "Bearer $USER_TOKEN" }
```

Edit comment (author or MANAGER):

```powershell
Invoke-RestMethod -Method Patch -Uri "$BASE_URL/comments/$COMMENT_ID" -ContentType "application/json" -Headers @{ Authorization = "Bearer $USER_TOKEN" } -Body (@{ comment = "Updated comment" } | ConvertTo-Json)
```

Delete comment (author or MANAGER):

```powershell
Invoke-RestMethod -Method Delete -Uri "$BASE_URL/comments/$COMMENT_ID" -Headers @{ Authorization = "Bearer $USER_TOKEN" }
```

### 8) Delete ticket (MANAGER)

```powershell
Invoke-RestMethod -Method Delete -Uri "$BASE_URL/tickets/$TICKET_ID" -Headers @{ Authorization = "Bearer $MANAGER_TOKEN" }
```
