type Notification = {
  id: number;
  title: string;
  body: string;
  email: string;
  isRead: boolean;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
};





export const notificationsData:Notification[] = [
  {
    "id": 1,
    "title": "Test",
    "body": "You did it",
    "email": "ketsi@gmail.com",
    "isRead": false,
    "isSelected": false,
    "createdAt": "2023-10-31T11:41:34.243Z",
    "updatedAt": "2023-10-31T11:41:34.243Z"
},
{
    "id": 3,
    "title": "test notification",
    "body": "body of test notifcation",
    "email": "hiwotzelalem3@gmail.com",
    "isRead": false,
    "isSelected": false,
    "createdAt": "2023-11-01T05:36:39.291Z",
    "updatedAt": "2023-11-01T05:36:39.291Z"
}
  ];