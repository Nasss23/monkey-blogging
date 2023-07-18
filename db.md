# Post

- Add new post
- id
- title
- slug
- image
- createAt
- status: 1(approved), 2(pending), 3(reject)
- content:
- userId
- categoryId

# Category

- id
- title
- slug
- status: 1(approved), 2(pending)
- createAt

# User

- id
- displayName
- email
- password
- avatar
- status: 1(active), 2(pending), 3(ban)
- role: 1(admin), 2(mod), 3(user)
- permissions:
- createAt
