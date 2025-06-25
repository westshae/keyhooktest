# Setup and run commands:
yarn install
yarn db:push
yarn dev

# Recruiter
None, personally reached out to Luke

# TLDR of requirements
Make a Proof of Concept for 'property managers to specify viewing availability, then allow tenants to book based on these availabilities'
1. Not expected to be prod ready, but comment on how to make it prod ready.
2. Ensure it's easy to accomplish the user goals. (PM oversight of meetings, tenant selecting times, etc)
3. Auth, email/sms can be skipped/faked.
4. No deployment, can use concepting tools (SQLite).

# Assumptions and notes
1. There is only one PM, and three tenants
  - The PM page assumes 'one PM' using it, this needs to be integrated into PM accounts for prod.
  - Tenant pages have a dropdown to 'test-select' a different tenant to use multiple.
2. No property-specific data is used
  - The PoC assumes the property is defined and determined outside of the scope of this feature.
  - Features might change based on the integration for prod.
3. Tenants, PMs and properties aren't stored via DB
  - These are stored as constants in the code, such as the 'tenant dropdown' defining ids there.

# Pages
## PM Page
1. 7 (days) wide, 24 (hours) tall grid, where each cell is split into 4 horizontal sections, indicating 15 minutes in an hour.
2. There are two modes of the grid, the 'view' and 'edit' mode via button near the grid.
3. For the edit mode, you drag down a column, and on release it splits the selection into 30 minute blocks.
4. Blocks are assumed to be weekly reoccuring.
5. On right click in edit mode, a modal to 'delete this slot once, or delete this and reoccuring slots' to delete slots.
6. The PM saves the changes, which saves to DB, and switches back to view mode
7. View mode shows the current slots, if they are booked, etc.
8. On the right side, there is a list of upcoming bookings, like a trello list, top being 'next booking'
9. Right clicking on the upcoming booking gives you options to get info about it more.
## Tenant Select Page
1. Similar grid to PM availability, without editing, where the available slots (excluding booked slots) are shown
2. When tenant clicks on a block, they get a modal to confirm their choice, which (saves to db, then redirects to tenant overview page) or (unselects and allows selecting again)
?. Note, on the tenant pages, there is a dropdown that allows you to select from one of three 'constant tenants' to simulate multiple tenants.
## Tenant Overview Page
1. Provides a list of all viewings upcoming in a trello-card like list, and if clicked on, provides more information like an accordion.
?. Note, on the tenant pages, there is a dropdown that allows you to select from one of three 'constant tenants' to simulate multiple tenants.

# Data Structures
1. Availability
  - id number
  - Date (DD-MM-YYYY)
  - Start time (HH:MM)
  - TimeInMinutes number
2. Booking
  - id number
  - Tenant ID number
  - Tenant Name (Removed when auth/account management is added for prod).
  - availability_id number
  - !!! (Not included here, but in prod, PM id would need to be included)

# General comments before programming begun
I decided to exclude DB storage of PMs, tenants and properties as these would be handled via reference id anyways from existing systems, and aren't necessary for the PoC. 
I decided to merge the PM 'define blocks' and 'overview' page, as I plan to use the same grid component for both, and two pages are unnecessary for this as they'd just have the same component on each page.
I decided on separate Tenant pages because it is assumed the Tenant doesn't manage all of their viewings through the platform, but rather would (assumingly) put the information from a confirmation email into their own time management system
As for the choice of tech stack, I have most of my experience with ReactJS, however I've been using NextJS for my quick projects, especially with drizzle, shadcnUI, etc. I'd normally use NeonDB, but in this case since no deployment, I used SQLite with drizzle instead.
There are a few choices that would need refining, such as how long the default slot length are, how much buffer is added, etc, however I consider this a user settings feature, in which I consider it out of scope for the PoC.
I also plan to include a section of the header for settings, such as 'reset all data', and the tenant changing, etc.


# Endpoint planning
1. api/availability
  - GET: Gets the currently stored availability of the PM
  - POST: Add availability in bulk for PM
  - DELETE: Remove in bulk availability for PM
2. api/availability/free
  - GET: Gets all availabilities, minus existing bookings, for Tenant.
3. api/bookings/pm
  - GET: Gets all bookings for PM
  - DELETE: Deletes 1 or many booking for PM
4. api/bookings/tenant
  - GET: Gets all bookings of a Tenant
  - POST: Adds a new booking for Tenant
  - DELETE: Deletes 1 booking for a Tenant

# Comments regarding my approach.
1. First, I defined in planning assumptions and the user-process required.
2. Then, I defined the pages required based on the process, and simplified it down
3. Then, I defined data structures and began implementation of the db schema.
4. Once the DB schema was done, I determined the 'root' endpoint, in this case everything is defined by availability
5. Implemented the availability endpoints excluding availability/free as that required booking, and determined I needed a better validation lib
6. Implemented Zod, which I've previously used for clean validation.
7. Just finished the tenant endpoints for booking, will implement availability/free, then pm bookings
8. Next step after this is a basic refactor, then beginning to implement the frontend.

# Breakdown of changes in regards to the frontend after re-reviewing the requirements and current plans
1. It's unlikely the tenant would want to use the platform itself to manage their viewings.
2. Due to this, the tenant overview page is being scrapped. This includes the tenant 'get' endpoint.
3. In production, an email/sms would be sent instead.
4. In addition to these changes, the pages have removed their tenant/pm url parent.
5. The availability/free GET endpoint will be moved into the bookings/tenant route to replace the above endpoint.

# Breakdown of pages
1. It's clear the grid needs to be a component.
  - The baseline component is the grid itself, that can hold cards.
  - There are 3 overall grid types
    1. Editing availability (dragging on grid to create cards, and clickable cards to delete.)
    2. Showing availability for PMs (Just showing cards)
    3. Showing tenants booking times (Showing cards, plus on click 'confirming' )
  - There are 3 different types of cards.
    1. Availability Creation: PMs create this, then can delete it
    2. Availability Viewing: Above, without interactability
    2. Booking Selection: Tenants select it.
  - Only one modal, a 'text + confirm button'
2. The PM grid has two versions, surrounding in one component with a 'edit/overview' toggle, which also saves it.