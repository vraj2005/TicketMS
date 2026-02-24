# Support Ticket Management API - Full Testing Guide

Base URL: http://localhost:3000

  --------------------------
  STEP 1 - LOGIN (MANAGER)
  --------------------------

POST /auth/login

{ "email": "manager@example.com", "password": "123456" }

  ------------------------------
  STEP 2 - CREATE SUPPORT USER
  ------------------------------

POST /users Authorization: Bearer `<MANAGER_TOKEN>`{=html}

{ "name": "Support One", "email": "support@example.com", "password":
"123456", "role": "SUPPORT" }

  -----------------------------
  STEP 3 - CREATE NORMAL USER
  -----------------------------

POST /users Authorization: Bearer `<MANAGER_TOKEN>`{=html}

{ "name": "User One", "email": "user@example.com", "password": "123456",
"role": "USER" }

  ------------------------
  STEP 4 - LOGIN AS USER
  ------------------------

POST /auth/login

{ "email": "user@example.com", "password": "123456" }

  ------------------------
  STEP 5 - CREATE TICKET
  ------------------------

POST /tickets Authorization: Bearer `<USER_TOKEN>`{=html}

{ "title": "System not working", "description": "The internal system is
not responding properly", "priority": "HIGH" }

  --------------------------------
  STEP 6 - MANAGER ASSIGN TICKET
  --------------------------------

PATCH /tickets/`<TICKET_ID>`{=html}/assign Authorization: Bearer
`<MANAGER_TOKEN>`{=html}

{ "userId": "`<SUPPORT_USER_ID>`{=html}" }

  ------------------------
  STEP 7 - SUPPORT LOGIN
  ------------------------

POST /auth/login

{ "email": "support@example.com", "password": "123456" }

  -----------------------------
  STEP 8 - UPDATE STATUS FLOW
  -----------------------------

PATCH /tickets/`<TICKET_ID>`{=html}/status Authorization: Bearer
`<SUPPORT_TOKEN>`{=html}

{ "status": "IN_PROGRESS" }

PATCH /tickets/`<TICKET_ID>`{=html}/status Authorization: Bearer
`<SUPPORT_TOKEN>`{=html}

{ "status": "RESOLVED" }

PATCH /tickets/`<TICKET_ID>`{=html}/status Authorization: Bearer
`<SUPPORT_TOKEN>`{=html}

{ "status": "CLOSED" }

  ----------------------
  STEP 9 - ADD COMMENT
  ----------------------

POST /tickets/`<TICKET_ID>`{=html}/comments Authorization: Bearer
`<SUPPORT_TOKEN>`{=html}

{ "comment": "Issue has been fixed successfully" }

  ------------------------
  STEP 10 - GET COMMENTS
  ------------------------

GET /tickets/`<TICKET_ID>`{=html}/comments Authorization: Bearer
`<SUPPORT_TOKEN>`{=html}

  ------------------------
  STEP 11 - EDIT COMMENT
  ------------------------

PATCH /comments/`<COMMENT_ID>`{=html} Authorization: Bearer
`<SUPPORT_TOKEN>`{=html}

{ "comment": "Final fix applied and verified" }

  --------------------------
  STEP 12 - DELETE COMMENT
  --------------------------

DELETE /comments/`<COMMENT_ID>`{=html} Authorization: Bearer
`<SUPPORT_TOKEN>`{=html}

  -----------------------------------
  STEP 13 - DELETE TICKET (MANAGER)
  -----------------------------------

DELETE /tickets/`<TICKET_ID>`{=html} Authorization: Bearer
`<MANAGER_TOKEN>`{=html}

  --------------------
  TEST INVALID CASES
  --------------------

1.  Call protected route without token → Expect 401
2.  USER trying to assign ticket → Expect 403
3.  Invalid status jump OPEN → RESOLVED → Expect 400
4.  Assign ticket to USER role → Expect 400
5.  Access other user ticket → Expect 403

  ------------------
  END OF TEST FILE
  ------------------
