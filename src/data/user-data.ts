import { UserType } from "@/types/user.types"
const UserData: UserType = {
    id: '1',
    firstName: 'Foulene Ben',
    lastName: 'Foulene',
    name: 'Foulene Ben Foulene',
    displayName: 'Foulene Ben Foulene',
    email: 'issaoui2121@gmail.com',
    emailVerified: true,
    role: 'admin',
    subrole: 'Director',
    status: 'active',
    imageUrl: 'https://i.pravatar.cc/150?img=70',
    avatar: '',
    permissions: ['users:read', 'users:write', 'admin:all'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    preferences: {
        theme: 'system',
        language: 'en',
        timezone: 'UTC',
        notifications: {
            email: true,
            push: true,
            sms: false,
            digest: 'daily',
            types: {
                grades: true,
                attendance: true,
                assignments: true,
                announcements: true,
                messages: true,
                events: true,
            },
        },
    },
};

export { UserData }
