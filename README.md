# LeetCode Together

A full-stack web application to track and compare LeetCode contest performances of you and your friends — with seamless integration of LeetCode and LCCN data. Automatically updates after contests and provides detailed, per-problem submission insights.

**🌐 Live Demo**: [leetcode-together.vercel.app](https://leetcode-together.vercel.app)

---
## Guide:

- Register.

- Login

- Enter your name and your exact LeetCode ID as shown on your LeetCode profile, then click Submit.

     <img width="800" height="1000" alt="image" src="https://github.com/user-attachments/assets/5f1a5d6f-216c-4533-982f-bbeb5da33a52" />


- Enter your friend's name (does not need to match their profile) and their exact LeetCode ID as it appears on their profile.

     <img width="800" height="1000" alt="image" src="https://github.com/user-attachments/assets/81a07235-5a09-4dfe-823e-49fae64f2573" />


- Finally, open the Contest Standings and click on ‘View Standings’ for the contest whose leaderboard you want to see.

     <img width="800" height="1000" alt="image" src="https://github.com/user-attachments/assets/23ee7da4-5d54-474a-9c7c-ae12434adce1" />


- You can visit your friend's rank page to watch their code replay, or click on their submission in the leaderboard to view their code. To see a problem statement, click on the corresponding question (A, B, C, or D) question and difficulty credit is beside it.
 

## 🧩Key Features

- Compare friend rankings after contest
- See score, rank, rating change, and number of wrong submission
- Per-question submissions with time and language
- Automatic contest data fetch (GitHub Actions)
- Efficient backend with MongoDB for performance
- Clean and responsive frontend UI

---

## 🛠 Tech Stack

- **Frontend:** React.js, Redux Toolkit, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT, bcrypt  
- **Deployment:** Vercel (Frontend), Render (Backend)

