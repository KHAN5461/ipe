# IPE III Practical Solutions (React JS)

Internal Practical Examination (IPE III) practical problem statements implemented with functional components, `useState`, `useEffect`, real REST APIs, and responsive Bootstrap cards.

---

## 📁 Project Structure

```
├── assets/
│   ├── q1-online-product-catalog/        # Q1: Online Product Catalog (E-Commerce)
│   ├── q2-student-academic-portal/       # Q2: Student Academic Portal (Education)
│   ├── q3-hospital-doctor-directory/     # Q3: Hospital Doctor Directory (Healthcare)
│   ├── q4-restaurant-menu-explorer/      # Q4: Restaurant Menu Explorer (Food)
│   ├── q5-travel-destination-explorer/   # Q5: Travel Destination Explorer (Travel)
│   ├── q6-job-search-portal/             # Q6: Job Search Portal (Job Portal)
│   ├── q7-news-reader-application/       # Q7: News Reader Application (News)
│   ├── q8-movie-explorer/                # Q8: Movie Explorer (Entertainment)
│   ├── q9-sports-team-portal/            # Q9: Sports Team Portal (Sports)
│   └── q10-digital-library/              # Q10: Digital Library (Library)
├── my-app/                               # Standalone React Application
│   ├── public/
│   └── src/                              # Active question components copied here
├── switch_question.ps1                   # PowerShell script to switch & run questions
├── switch_question.sh                    # Bash script for Linux/macOS/Git Bash
├── run.ps1                               # PowerShell alias
├── run.sh                                # Bash alias
└── run.bat                               # Windows CMD batch launcher
```

---

## 🚀 How to Run Any Question

### Option 1: Using PowerShell (Windows)
```powershell
# Interactive mode (displays menu of all questions):
powershell -ExecutionPolicy Bypass -File .\switch_question.ps1

# Direct mode (supports question number, name, or keyword):
powershell -ExecutionPolicy Bypass -File .\switch_question.ps1 -Question q1
powershell -ExecutionPolicy Bypass -File .\switch_question.ps1 -Question 2
powershell -ExecutionPolicy Bypass -File .\switch_question.ps1 -Question doctor
powershell -ExecutionPolicy Bypass -File .\switch_question.ps1 -Question 10
```

### Option 2: Using Bash (Linux / macOS / Git Bash)
```bash
# Make script executable:
chmod +x switch_question.sh run.sh

# Interactive mode:
./switch_question.sh

# Direct mode:
./switch_question.sh q1
./switch_question.sh 2
./switch_question.sh doctor
./switch_question.sh 10
```

### Option 3: Using Windows Command Prompt / Double Click
```cmd
run.bat q1
```

---

## 🛠 Manual Execution in `my-app`
After switching to your desired question:
```bash
cd my-app
npm start
```
The app will open automatically at `http://localhost:3000`.
