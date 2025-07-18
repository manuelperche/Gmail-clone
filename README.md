# Gmail Clone

## Project Overview

  This is a heavily scoped-down Gmail clone built with React and TypeScript, implementing core email management functionality with Gmail-like behavior. The project emphasizes clean architecture, proper separation
  of concerns, and exact replication of Gmail's operational behavior.

  Key Features

  - 8 Thread Groupings: Inbox, Starred, Snoozed, Sent, Drafts, All Mail, Spam, Trash
  - Bulk Operations: Archive/Unarchive, Mark as Spam/Not Spam, Trash/Restore, Mark Read/Unread, Snooze/Unsnooze, Delete Forever
  - Smart Selection: Gmail-style checkbox dropdown with filters (All, None, Read, Unread, Starred, Unstarred)
  - Thread Detail View: Full conversation view with individual email starring and operations
  - Real Gmail Behavior: Operations behave exactly as they do in Gmail, including contextual availability
  - Dataset: Realistic mock data with various email types and states
  - Frozen Time: Always operates as if it's March 14, 2030 @ 3:14 PM

<img width="2976" height="1256" alt="image" src="https://github.com/user-attachments/assets/572dfd05-b825-4457-9362-c31f8796ecf3" />


## To run this project:

```
git clone https://github.com/manuelperche/Gmail-clone.git

cd Gmail-clone

yarn install

yarn run dev
```
