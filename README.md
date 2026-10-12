# IPE III Practical Solutions (React JS)

Internal Practical Examination (IPE III) practical problem statements implemented with functional components, `useState`, `useEffect`, real REST APIs, and responsive Bootstrap cards.

---

## 📁 Project Structure

```
├── assets/                  # 10 Solved Problem Statements (q1 to q10)
│   ├── q1/                  # Q1: Online Product Catalog (E-Commerce)
│   ├── q2/                  # Q2: Student Academic Portal (Education)
│   ├── q3/                  # Q3: Hospital Doctor Directory (Healthcare)
│   ├── q4/                  # Q4: Restaurant Menu Explorer (Food)
│   ├── q5/                  # Q5: Travel Destination Explorer (Travel)
│   ├── q6/                  # Q6: Job Search Portal (Job Portal)
│   ├── q7/                  # Q7: News Reader Application (News)
│   ├── q8/                  # Q8: Movie Explorer (Entertainment)
│   ├── q9/                  # Q9: Sports Team Portal (Sports)
│   └── q10/                 # Q10: Digital Library (Library)
├── my-app/                  # Standalone React Application
│   ├── public/
│   └── src/                 # Active question components copied here
├── switch_question.ps1      # PowerShell script to switch & run questions
├── switch_question.sh       # Bash script for Linux/macOS/Git Bash
├── run.ps1                  # PowerShell alias
├── run.sh                   # Bash alias
└── run.bat                  # Windows CMD batch launcher
```

---

## 🚀 How to Run Any Question

### Option 1: Using PowerShell (Windows)
```powershell
# Interactive mode (prompts for question e.g. q1, q2, etc.):
powershell -ExecutionPolicy Bypass -File .\switch_question.ps1

# Direct mode:
powershell -ExecutionPolicy Bypass -File .\switch_question.ps1 -Question q1
```

### Option 2: Using Bash (Linux / macOS / Git Bash)
```bash
# Make script executable:
chmod +x switch_question.sh run.sh

# Interactive mode:
./switch_question.sh

# Direct mode:
./switch_question.sh q1
```

### Option 3: Using Windows Command Prompt / Double Click
```cmd
run.bat q1
```

---

## 🛠 Manual Execution in `my-app`
After running the switcher script:
```bash
cd my-app
npm start
```
The app will open automatically at `http://localhost:3000`.
