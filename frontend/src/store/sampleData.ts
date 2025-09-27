import type { Board } from "./useBoardStore";
import type { User } from "./useAuthStore";

export const sampleUserData: {user: User; boards:Board[]} = {
  user: {
    _id: "u1",
    username: "janwilhelm",
    email: "jan@example.com",
    avatar: "https://i.pravatar.cc/150?u=u1"
  },
  boards: [
    {
      _id: "b1",
      title: "Frontend Project",
      description: "UI/UX and React components, including responsive layouts, interactive elements, component-based architecture, state management with hooks, and integration with backend APIs to ensure a seamless user experience across devices and platforms.",
      owner: "u1",
      collaborators: [
        { user: "u2", role: "editor", pending: false },
        { user: "u3", role: "viewer", pending: true }
      ],
      sections: [
        {
          name: "To Do",
          tasks: [
            {
              task_name: "Setup project",
              done: true,
              checklist: [
                { sub_task: "Install Vite", done: true },
                { sub_task: "Add Tailwind", done: false }
              ],
              activities: [
                { user: "u1", message: "Task was created", createdAt: "2025-09-20T10:00:00Z" }
              ]

            }
          ]
        },
        {
          name: "In Progress",
          tasks: [
            {
              task_name: "Navbar Component",
              done: false,
              checklist: [{ sub_task: "Responsive design", done: false }],
              activities: [
                { user: "u2", message: "Started working on it", createdAt: "2025-09-21T14:00:00Z" }
              ]
            }
          ]
        }
      ],
      lastOpened: "2025-09-25T14:30:00Z",
      favorite: true,
      pinned: false
    },
    {
      _id: "b2",
      title: "Backend API",
      description: "Express + MongoDB setup",
      owner: "u1",
      collaborators: [],
      sections: [
        {
          name: "To Do",
          tasks: [
            {
              task_name: "Setup MongoDB schema",
              done: false,
              checklist: [{ sub_task: "Define User model", done: true }],
              activities: [
                { user: "u1", message: "Task was created", createdAt: "2025-09-22T09:00:00Z" }
              ]
            }
          ]
        }
      ],
      lastOpened: "2025-09-23T16:00:00Z",
      favorite: false,
      pinned: false
    },
    {
      _id: "b3",
      title: "Marketing Board",
      description: "Collaboration with Alice",
      owner: "u2",
      collaborators: [{ user: "u1", role: "editor", pending: false }, { user: "u3", role: "viewer", pending: false }],
      sections: [
        {
          name: "Ideas",
          tasks: [
            {
              task_name: "Social media plan",
              done: false,
              checklist: [{ sub_task: "Draft schedule", done: false }],
              activities: [
                { user: "u2", message: "Added task", createdAt: "2025-09-23T08:00:00Z" }
              ]
            }
          ]
        }
      ],
      lastOpened: "2025-09-22T09:45:00Z",
      favorite: false,
      pinned: true
    },
    {
      _id: "b4",
      title: "Shared Research",
      description: "Knowledge sharing board",
      owner: "u3",
      collaborators: [{ user: "u1", role: "viewer", pending: false }],
      sections: [
        {
          name: "Research Topics",
          tasks: [
            {
              task_name: "AI Trends",
              done: false,
              checklist: [
                { sub_task: "Collect articles", done: true },
                { sub_task: "Summarize findings", done: false }
              ],
              activities: [
                { user: "u3", message: "Started topic", createdAt: "2025-09-22T12:00:00Z" }
              ]
            }
          ]
        }
      ],
      lastOpened: "2025-09-21T11:15:00Z",
      favorite: false,
      pinned: false
    }
  ]
};
